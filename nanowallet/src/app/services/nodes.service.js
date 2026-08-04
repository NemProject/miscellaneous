import nem from 'nem-sdk';
import UrlParser from 'url-parse';

const NODEWATCH_BASE_URL = 'https://nodewatch.symbol.tools';

const NETWORK_NODE_CONFIG = {
    [nem.model.network.data.mainnet.id]: {
        url: `${NODEWATCH_BASE_URL}/api/nem/nodes`,
        cacheKey: 'nodewatchNodes_mainnet'
    },
    [nem.model.network.data.testnet.id]: {
        url: `${NODEWATCH_BASE_URL}/testnet/api/nem/nodes`,
        cacheKey: 'nodewatchNodes_testnet'
    }
};
var NODEWATCH_NODES_DEFAULT_PORT = nem.model.nodes.defaultPort;
var NODEWATCH_NODES_HEIGHT_TOLERANCE = 20;
var NODEWATCH_NODES_MIN_NODES = 3;
var NODEWATCH_NODES_FETCH_TIMEOUT_MS = 8000;
var NODEWATCH_NODES_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
var NODEWATCH_NODES_PRIVATE_HOST_RE = /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|0\.0\.0\.0$)|^localhost$|^\[?::1\]?$/i;

/**
 * Parse a "scheme://host:port" endpoint string as returned by NodeWatch
 *
 * @param {string} raw - The raw endpoint string
 *
 * @return {object|null} - {scheme, hostname, port} or null if unparsable
 */
function parseNodewatchNodeEndpoint(raw) {
    var m = /^(https?):\/\/([^:\/\s]+):(\d+)\/?$/i.exec(String(raw || '').trim());
    if (!m) return null;
    return { scheme: m[1].toLowerCase(), hostname: m[2], port: parseInt(m[3], 10) };
}

/**
 * Validate and normalize a single NodeWatch entry
 *
 * Keeps only default-port, non-private-host entries with a valid height.
 *
 * @param {*} entry - A single entry from the NodeWatch API response
 *
 * @return {object|null} - {uri, height}, or null if the entry is unusable
 */
function parseNodewatchEntry(entry) {
    var endpoint = entry && parseNodewatchNodeEndpoint(entry.endpoint);
    if (!endpoint) return null;
    if (endpoint.port !== NODEWATCH_NODES_DEFAULT_PORT) return null;
    if (NODEWATCH_NODES_PRIVATE_HOST_RE.test(endpoint.hostname)) return null;
    if (typeof entry.height !== 'number' || entry.height <= 0) return null;
    return { uri: endpoint.scheme + '://' + endpoint.hostname, height: entry.height };
}

/**
 * Filter and normalize a NodeWatch API response into a list of usable nodes
 *
 * Keeps only default-port, non-private-host nodes within the configured
 * height tolerance of the highest reported height.
 *
 * @param {*} json - The parsed NodeWatch response body
 *
 * @return {array|null} - An array of {uri} objects, or null if nothing usable
 */
function processNodewatchResponse(json) {
    if (!Array.isArray(json)) return null;

    var candidates = [];
    for (var i = 0; i < json.length; i++) {
        var candidate = parseNodewatchEntry(json[i]);
        if (candidate) candidates.push(candidate);
    }
    if (!candidates.length) return null;

    var maxHeight = 0;
    for (var j = 0; j < candidates.length; j++) {
        if (candidates[j].height > maxHeight) maxHeight = candidates[j].height;
    }

    var seen = Object.create(null);
    var result = [];
    for (var index = 0; index < candidates.length; index++) {
        var candidate = candidates[index];
        if ((maxHeight - candidate.height) > NODEWATCH_NODES_HEIGHT_TOLERANCE) continue;
        var key = candidate.uri.toLowerCase();
        if (seen[key]) continue;
        seen[key] = true;
        result.push({ uri: candidate.uri });
    }
    return result;
}

/**
 * Check whether a node list is usable, i.e. an array with at least the
 * configured minimum number of nodes.
 *
 * @param {*} nodes - The candidate node list
 *
 * @return {boolean} - True if the list is usable
 */
function isUsableNodeList(nodes) {
    return Array.isArray(nodes) && nodes.length >= NODEWATCH_NODES_MIN_NODES;
}

/**
 * Fetch JSON from a URL, rejecting if it doesn't resolve within the timeout
 *
 * @param {string} url - The URL to fetch
 * @param {number} ms - Timeout in milliseconds
 *
 * @return {Promise} - Resolves with the parsed JSON body
 */
function fetchJsonWithTimeout(url, ms) {
    return new Promise(function (resolve, reject) {
        var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        var timer = setTimeout(function () {
            if (ctrl) ctrl.abort();
            reject(new Error('timeout'));
        }, ms);
        fetch(url, { signal: ctrl ? ctrl.signal : undefined, cache: 'no-store' }).then(function (res) {
            clearTimeout(timer);
            if (!res.ok) { reject(new Error('http ' + res.status)); return; }
            resolve(res.json());
        }, function (err) {
            clearTimeout(timer);
            reject(err);
        });
    });
}

/** Service with functions regarding the nodes */
class Nodes {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor($localStorage, Wallet, Alert, $filter, $timeout) {
        'ngInject';

        //// Service dependencies region ////

        this._storage = $localStorage;
        this._Wallet = Wallet;
        this._Alert = Alert;
        this._$filter = $filter;
        this._$timeout = $timeout;

        nem.model.nodes.testnet = [{
            uri: 'http://libertalia.nemtest.net'
        }, {
            uri: 'http://ocracoke.nemtest.net'
        }, {
            uri: 'http://tortuga.nemtest.net'
        }, {
            uri: 'http://ntn1.dusanjp.com'
        }, {
            uri: 'http://localhost'
        }];

        nem.model.nodes.mainnet = [{
            uri: 'http://portobelo.nemmain.net'
        }, {
            uri: 'http://hugealice.nem.ninja'
        }, {
            uri: 'http://hugealice2.nem.ninja'
        }, {
            uri: 'http://hugealice3.nem.ninja'
        }, {
            uri: 'http://1n.dusanjp.com'
        }, {
            uri: 'http://2n.dusanjp.com'
        }, {
            uri: 'http://localhost'
        }];

        //// End dependencies region ////
    }

    //// Service methods region ////

    /**
     * Set util nodes according to network
     */
    setUtil() {
        if (this._Wallet.network === nem.model.network.data.testnet.id) {
            this._Wallet.searchNode = nem.model.objects.create("endpoint")(nem.model.nodes.searchOnTestnet[0].uri, nem.model.nodes.defaultPort);
            this._Wallet.chainLink = nem.model.nodes.testnetExplorer;
        } else if (this._Wallet.network === nem.model.network.data.mainnet.id) {
            this._Wallet.searchNode = nem.model.objects.create("endpoint")(nem.model.nodes.searchOnMainnet[0].uri, nem.model.nodes.defaultPort);
            this._Wallet.chainLink = nem.model.nodes.mainnetExplorer;
        } else {
            this._Wallet.searchNode = nem.model.objects.create("endpoint")(nem.model.nodes.searchOnMijin[0].uri, nem.model.nodes.mijinPort);
            this._Wallet.chainLink = nem.model.nodes.mijinExplorer;
        }
        return;
    }

    /**
     * Check if nodes present in local storage or set default according to network
     */
    setDefault() {
        if (this._Wallet.network == nem.model.network.data.mainnet.id) {
            if (this._storage.selectedMainnetNode) {
                this._Wallet.node = this._storage.selectedMainnetNode;
            } else {
                let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.mainnet[0].uri, nem.model.nodes.defaultPort);
                this._Wallet.node = endpoint;
            }
            this._Wallet.nodes = nem.model.nodes.mainnet;
        } else if (this._Wallet.network == nem.model.network.data.testnet.id) {
            if (this._storage.selectedTestnetNode) {
                this._Wallet.node = this._storage.selectedTestnetNode;
            } else {
                let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.testnet[0].uri, nem.model.nodes.defaultPort);
                this._Wallet.node = endpoint;
            }
            this._Wallet.nodes = nem.model.nodes.testnet;
        } else {
            if (this._storage.selectedMijinNode) {
                this._Wallet.node = this._storage.selectedMijinNode;
            } else {
                let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.mijin[0].uri, nem.model.nodes.mijinPort);
                this._Wallet.node = endpoint;
            }
            this._Wallet.nodes = nem.model.nodes.mijin;
        }
        return;
    }

    /**
     * Update the node in Wallet service and update local storage
     * If no endpoint provided a random node will be used
     *
     * @param {object} endpoint - An endpoint object (optional)
     */
    update(endpoint) {
        let _endpoint;
        // Set node in local storage according to network
        if (this._Wallet.network == nem.model.network.data.mainnet.id) {
            _endpoint = endpoint || nem.model.objects.create("endpoint")(nem.model.nodes.mainnet[Math.floor(Math.random()*nem.model.nodes.mainnet.length)].uri, nem.model.nodes.defaultPort);
            this._storage.selectedMainnetNode = _endpoint;
        } else if (this._Wallet.network == nem.model.network.data.testnet.id) {
            _endpoint = endpoint || nem.model.objects.create("endpoint")(nem.model.nodes.testnet[Math.floor(Math.random()*nem.model.nodes.testnet.length)].uri, nem.model.nodes.defaultPort);
            this._storage.selectedTestnetNode = _endpoint;
        } else {
            _endpoint = endpoint || nem.model.objects.create("endpoint")(nem.model.nodes.mijin[Math.floor(Math.random()*nem.model.nodes.mijin.length)].uri, nem.model.nodes.mijinPort);
            this._storage.selectedMijinNode = _endpoint;
        }
        // Set endpoint in Wallet service
        this._Wallet.node = _endpoint;
        return;
    }

    /**
     * Clean an host input and create an endpoint object if valid
     *
     * @param {string} host - An NIS hostname
     * @param {number} port - An NIS port (optional)
     *
     * @return {object|boolean} - An endpoint object if success, false otherwise
     */
    cleanEndpoint(host, port) {
        // Validate host
        var regexp = /^(?:(?:https?):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        if(!regexp.test(host) && (host !== 'http://localhost' && host !== 'localhost')) {
            console.log("Invalid endpoint");
            return false;
        }
        // Create an empty endpoint object
        let endpoint = nem.model.objects.get("endpoint");

        // Parse the url given by user
        let parsed = new UrlParser(host);

        // Check if protocol is set or set default
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') parsed = new UrlParser('http://' + host);

        // Set host in endpoint object
        endpoint.host = parsed.protocol + '//' + parsed.hostname;

        // Arrange port, set default if not specified
        if (parsed.port) {
            endpoint.port = parsed.port;
        } else if (port) {
            endpoint.port = port;
        } else {
            if (this._Wallet.network === nem.model.network.data.mainnet.id) {
                endpoint.port = nem.model.nodes.defaultPort;
            } else if (this._Wallet.network === nem.model.network.data.testnet.id) {
                endpoint.port = nem.model.nodes.defaultPort;
            } else {
                endpoint.port = nem.model.nodes.mijinPort;
            }
        }
        return endpoint;
    }

    /**
     * Return nodes according to a network
     *
     * @param {number} network - A network id (optional)
     * @param {boolean} searchEnabled - True if getting nodes with search enabled, false otherwise (optional)
     *
     * @return {array} - An array of endpoint objects
     */
    get(network, searchEnabled) {
        let _network = network || this._Wallet.network;
        let _searchEnabled = searchEnabled || false;
        // Show right nodes list according to network
        if (_network == nem.model.network.data.mainnet.id) {
            if (_searchEnabled) return this._$filter('toEndpoint')(nem.model.nodes.searchOnMainnet);
            return this._$filter('toEndpoint')(nem.model.nodes.mainnet);
        } else if (_network == nem.model.network.data.testnet.id) {
            if (_searchEnabled) return this._$filter('toEndpoint')(nem.model.nodes.searchOnTestnet);
            return this._$filter('toEndpoint')(nem.model.nodes.testnet);
        } else {
            if (_searchEnabled) return this._$filter('toEndpoint')(nem.model.nodes.searchOnMijin);
            return this._$filter('toEndpoint')(nem.model.nodes.mijin);
        }
    }

    /**
     * Get harvesting node from local storage if it exists
     */
    getHarvestingEndpoint() {
        if (this._Wallet.network == nem.model.network.data.mainnet.id) {
            if (this._storage.harvestingMainnetNode) return this._storage.harvestingMainnetNode;
        } else if (this._Wallet.network == nem.model.network.data.testnet.id) {
            if (this._storage.harvestingTestnetNode) return this._storage.harvestingTestnetNode;
        } else {
            if (this._storage.harvestingMijinNode) return this._storage.harvestingMijinNode;
        }
        return this._Wallet.node;
    }

    /**
     * Save the harvesting node in local storage according to network
     */
    saveHarvestingEndpoint(endpoint) {
        if (this._Wallet.network == nem.model.network.data.mainnet.id) {
            this._storage.harvestingMainnetNode = endpoint;
        } else if (this._Wallet.network == nem.model.network.data.testnet.id) {
            this._storage.harvestingTestnetNode = endpoint;
        } else {
            this._storage.harvestingMijinNode = endpoint;
        }
    }

    /**
     * Refresh Wallet.nodes with a live, active node list fetched from NodeWatch.
     *
     * Fails safe at every step: any error, timeout, or lack of data leaves
     * the currently set (bundled static, or last cached) node list untouched.
     *
     * @param {number} network - A network id (optional, defaults to current network)
     *
     * @return {Promise} - Resolves with the applied node array, or null if unchanged
     */
    loadNetworkNodes(network) {
        let _network = network || this._Wallet.network;
        let config = NETWORK_NODE_CONFIG[_network];
        if (!config) return Promise.resolve(null);

        let cached = this._storage[config.cacheKey];
        let hasValidCache = cached && isUsableNodeList(cached.nodes);
        let hasFreshCache = hasValidCache && (Date.now() - cached.fetchedAt) < NODEWATCH_NODES_CACHE_TTL_MS;

        let apply = (nodes) => {
            if (!isUsableNodeList(nodes)) return null;
            // Assign inside a digest, the fetch above resolves outside of one
            this._$timeout(() => {
                this._Wallet.nodes = nodes;
            });
            return nodes;
        };

        if (hasFreshCache) {
            return Promise.resolve(apply(cached.nodes));
        }

        return fetchJsonWithTimeout(config.url, NODEWATCH_NODES_FETCH_TIMEOUT_MS).then((json) => {
            let processed = processNodewatchResponse(json);
            if (!isUsableNodeList(processed)) {
                return hasValidCache ? apply(cached.nodes) : null;
            }
            this._storage[config.cacheKey] = { fetchedAt: Date.now(), nodes: processed };
            return apply(processed);
        }).catch(() => {
            return hasValidCache ? apply(cached.nodes) : null;
        });
    }

    /**
     * Check if a node has free slots
     *
     * @param  {object} endpoint - An endpoint object
     */
    hasFreeSlots(endpoint) {
        if (!endpoint) return false;
        return nem.com.requests.account.unlockInfo(endpoint).then((data) => {
            return this._$timeout(() => {
                if (data["max-unlocked"] === data["num-unlocked"]) {
                    return false;
                } else {
                    return true;
                }
            });
        },
        (err) => {
            return this._$timeout(() => {
                this._Alert.unlockedInfoError(err.data.message);
                return false;
            });
        });
    }

    //// End methods region ////

}

export default Nodes;
