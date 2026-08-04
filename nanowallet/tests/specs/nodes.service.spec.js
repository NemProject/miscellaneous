import Nodes from '../../src/app/services/nodes.service';
import nem from 'nem-sdk';

describe('Nodes Service', () => {
    let nodesService;
    let mockStorage;
    let mockWallet;
    let mockAlert;
    let mockFilter;
    let mockTimeout;

    const MAINNET_NETWORK = nem.model.network.data.mainnet.id;
    const TESTNET_NETWORK = nem.model.network.data.testnet.id;
    const MIJIN_NETWORK = nem.model.network.data.mijin.id;

    beforeEach(() => {
        mockStorage = {};
        mockWallet = { network: TESTNET_NETWORK };
        mockAlert = { unlockedInfoError: jasmine.createSpy('unlockedInfoError') };
        mockFilter = jasmine.createSpy('$filter').and.returnValue(data => data);
        mockTimeout = fn => Promise.resolve().then(fn);

        nodesService = new Nodes(mockStorage, mockWallet, mockAlert, mockFilter, mockTimeout);
    });

    describe('constructor', () => {
        it('sets a fixed testnet node list on nem.model.nodes', () => {
            // Assert:
            expect(nem.model.nodes.testnet).toEqual([
                { uri: 'http://libertalia.nemtest.net' },
                { uri: 'http://ocracoke.nemtest.net' },
                { uri: 'http://tortuga.nemtest.net' },
                { uri: 'http://ntn1.dusanjp.com' },
                { uri: 'http://localhost' }
            ]);
        });

        it('sets a fixed mainnet node list on nem.model.nodes', () => {
            // Assert:
            expect(nem.model.nodes.mainnet).toEqual([
                { uri: 'http://portobelo.nemmain.net' },
                { uri: 'http://hugealice.nem.ninja' },
                { uri: 'http://hugealice2.nem.ninja' },
                { uri: 'http://hugealice3.nem.ninja' },
                { uri: 'http://1n.dusanjp.com' },
                { uri: 'http://2n.dusanjp.com' },
                { uri: 'http://localhost' }
            ]);
        });
    });

    describe('getRandomNodeUri', () => {
        it('returns a node of the given list', () => {
            // Arrange:
            const nodes = [{ uri: 'http://node1' }, { uri: 'http://node2' }, { uri: 'http://node3' }];

            // Act:
            const result = nodesService.getRandomNodeUri(nodes);

            // Assert:
            expect(nodes).toContain({ uri: result });
        });

        it('can pick any node of the given list', () => {
            // Arrange:
            const nodes = [{ uri: 'http://node1' }, { uri: 'http://node2' }, { uri: 'http://node3' }];
            const randoms = [0, 0.4, 0.9];
            let index = 0;
            spyOn(Math, 'random').and.callFake(() => randoms[index++]);

            // Act:
            const result = randoms.map(() => nodesService.getRandomNodeUri(nodes));

            // Assert:
            expect(result).toEqual(['http://node1', 'http://node2', 'http://node3']);
        });

        it('never picks the local node when other nodes are available', () => {
            // Arrange:
            const nodes = [{ uri: 'http://node1' }, { uri: 'http://localhost' }];
            const randoms = [0, 0.5, 0.99];
            let index = 0;
            spyOn(Math, 'random').and.callFake(() => randoms[index++]);

            // Act:
            const result = randoms.map(() => nodesService.getRandomNodeUri(nodes));

            // Assert:
            expect(result).toEqual(['http://node1', 'http://node1', 'http://node1']);
        });

        it('picks the local node when it is the only one available', () => {
            // Act:
            const result = nodesService.getRandomNodeUri([{ uri: 'http://localhost' }]);

            // Assert:
            expect(result).toEqual('http://localhost');
        });
    });

    describe('cleanEndpoint', () => {
        it('returns an endpoint object with default port for mainnet', () => {
            // Arrange:
            mockWallet.network = MAINNET_NETWORK;

            // Act:
            const result = nodesService.cleanEndpoint('http://alice.nem.ninja');

            // Assert:
            expect(result).toEqual({ host: 'http://alice.nem.ninja', port: nem.model.nodes.defaultPort });
        });

        it('returns an endpoint object with default port for mijin', () => {
            // Arrange:
            mockWallet.network = MIJIN_NETWORK;

            // Act:
            const result = nodesService.cleanEndpoint('http://mijin.example.com');

            // Assert:
            expect(result).toEqual({ host: 'http://mijin.example.com', port: nem.model.nodes.mijinPort });
        });

        it('uses the port from the host string when present', () => {
            // Act:
            const result = nodesService.cleanEndpoint('http://alice.nem.ninja:7891');

            // Assert:
            expect(result).toEqual({ host: 'http://alice.nem.ninja', port: '7891' });
        });

        it('uses the provided port argument when host has no port', () => {
            // Act:
            const result = nodesService.cleanEndpoint('http://alice.nem.ninja', 7891);

            // Assert:
            expect(result).toEqual({ host: 'http://alice.nem.ninja', port: 7891 });
        });

        it('returns false for an invalid host', () => {
            // Act:
            const result = nodesService.cleanEndpoint('not a valid host!!');

            // Assert:
            expect(result).toBe(false);
        });

        it('accepts localhost as a valid host', () => {
            // Act:
            const result = nodesService.cleanEndpoint('localhost');

            // Assert:
            expect(result).not.toBe(false);
        });
    });

    describe('setDefault', () => {
        it('uses the stored mainnet node when present', () => {
            // Arrange:
            mockWallet.network = MAINNET_NETWORK;
            mockStorage.selectedMainnetNode = { host: 'http://stored.example.com', port: 7890 };

            // Act:
            nodesService.setDefault();

            // Assert:
            expect(mockWallet.node).toBe(mockStorage.selectedMainnetNode);
            expect(mockWallet.nodes).toBe(nem.model.nodes.mainnet);
        });

        it('falls back to a random bundled testnet node when nothing is stored', () => {
            // Arrange:
            mockWallet.network = TESTNET_NETWORK;

            // Act:
            nodesService.setDefault();

            // Assert:
            expect(nem.model.nodes.testnet).toContain({ uri: mockWallet.node.host });
            expect(mockWallet.node.host).not.toEqual('http://localhost');
            expect(mockWallet.node.port).toEqual(nem.model.nodes.defaultPort);
            expect(mockWallet.nodes).toBe(nem.model.nodes.testnet);
        });

        it('falls back to a random bundled mainnet node when nothing is stored', () => {
            // Arrange:
            mockWallet.network = MAINNET_NETWORK;

            // Act:
            nodesService.setDefault();

            // Assert:
            expect(nem.model.nodes.mainnet).toContain({ uri: mockWallet.node.host });
            expect(mockWallet.node.host).not.toEqual('http://localhost');
            expect(mockWallet.node.port).toEqual(nem.model.nodes.defaultPort);
            expect(mockWallet.nodes).toBe(nem.model.nodes.mainnet);
        });
    });

    describe('update', () => {
        it('stores a given endpoint as the selected testnet node', () => {
            // Arrange:
            mockWallet.network = TESTNET_NETWORK;
            const endpoint = nem.model.objects.create('endpoint')('http://custom.example.com', 7890);

            // Act:
            nodesService.update(endpoint);

            // Assert:
            expect(mockWallet.node).toBe(endpoint);
            expect(mockStorage.selectedTestnetNode).toBe(endpoint);
        });

        it('picks a random bundled mainnet node when no endpoint is given', () => {
            // Arrange:
            mockWallet.network = MAINNET_NETWORK;

            // Act:
            nodesService.update();

            // Assert:
            expect(nem.model.nodes.mainnet).toContain({ uri: mockWallet.node.host });
            expect(mockWallet.node.host).not.toEqual('http://localhost');
            expect(mockStorage.selectedMainnetNode).toBe(mockWallet.node);
        });
    });

    describe('get', () => {
        it('returns mainnet nodes through the toEndpoint filter', () => {
            // Act:
            const result = nodesService.get(MAINNET_NETWORK);

            // Assert:
            expect(mockFilter).toHaveBeenCalledWith('toEndpoint');
            expect(result).toBe(nem.model.nodes.mainnet);
        });

        it('returns search-enabled testnet nodes when requested', () => {
            // Act:
            const result = nodesService.get(TESTNET_NETWORK, true);

            // Assert:
            expect(result).toBe(nem.model.nodes.searchOnTestnet);
        });
    });

    describe('loadNetworkNodes', () => {
        const NODEWATCH_TESTNET_URL = 'https://nodewatch.symbol.tools/testnet/api/nem/nodes';

        const nodewatchResponse = (overrides = []) => [
            { endpoint: 'http://node1.example.com:7890', height: 1000 },
            { endpoint: 'http://node2.example.com:7890', height: 995 },
            { endpoint: 'http://node3.example.com:7890', height: 985 },
            { endpoint: 'http://too-old.example.com:7890', height: 900 },
            { endpoint: 'http://127.0.0.1:7890', height: 1000 },
            { endpoint: 'http://wrong-port.example.com:7891', height: 1000 },
            { endpoint: 'not-a-valid-endpoint', height: 1000 },
            ...overrides
        ];

        const mockFetchResolves = json => spyOn(window, 'fetch').and.returnValue(
            Promise.resolve({ ok: true, json: () => Promise.resolve(json) })
        );

        const mockFetchRejects = () => spyOn(window, 'fetch').and.returnValue(
            Promise.reject(new Error('network error'))
        );

        beforeEach(() => {
            mockWallet.network = TESTNET_NETWORK;
        });

        it('resolves null without touching Wallet.nodes for an unsupported network', (done) => {
            // Arrange:
            mockWallet.network = MIJIN_NETWORK;
            const fetchSpy = spyOn(window, 'fetch');

            // Act:
            nodesService.loadNetworkNodes().then(result => {
                // Assert:
                expect(result).toBeNull();
                expect(fetchSpy).not.toHaveBeenCalled();
                done();
            });
        });

        it('applies a fresh cached node list without calling fetch', (done) => {
            // Arrange:
            const cachedNodes = [{ uri: 'http://a' }, { uri: 'http://b' }, { uri: 'http://c' }];
            mockStorage.nodewatchNodes_testnet = { fetchedAt: Date.now(), nodes: cachedNodes };
            const fetchSpy = spyOn(window, 'fetch');

            // Act:
            nodesService.loadNetworkNodes().then(result => {
                // Assert:
                expect(result).toBe(cachedNodes);
                expect(mockWallet.nodes).toBe(cachedNodes);
                expect(fetchSpy).not.toHaveBeenCalled();
                done();
            });
        });

        it('fetches, filters and caches nodes when there is no fresh cache', (done) => {
            // Arrange:
            const fetchSpy = mockFetchResolves(nodewatchResponse());

            // Act:
            nodesService.loadNetworkNodes().then(result => {
                // Assert:
                expect(fetchSpy).toHaveBeenCalledWith(NODEWATCH_TESTNET_URL, jasmine.any(Object));
                expect(result).toEqual([
                    { uri: 'http://node1.example.com' },
                    { uri: 'http://node2.example.com' },
                    { uri: 'http://node3.example.com' }
                ]);
                expect(mockWallet.nodes).toEqual(result);
                expect(mockStorage.nodewatchNodes_testnet.nodes).toEqual(result);
                done();
            });
        });

        it('refetches when the cached node list has expired', (done) => {
            // Arrange:
            mockStorage.nodewatchNodes_testnet = {
                fetchedAt: Date.now() - (7 * 60 * 60 * 1000),
                nodes: [{ uri: 'http://stale' }, { uri: 'http://stale2' }, { uri: 'http://stale3' }]
            };
            const fetchSpy = mockFetchResolves(nodewatchResponse());

            // Act:
            nodesService.loadNetworkNodes().then(() => {
                // Assert:
                expect(fetchSpy).toHaveBeenCalled();
                done();
            });
        });

        it('falls back to the cached node list when the fetch fails', (done) => {
            // Arrange:
            const cachedNodes = [{ uri: 'http://a' }, { uri: 'http://b' }, { uri: 'http://c' }];
            mockStorage.nodewatchNodes_testnet = {
                fetchedAt: Date.now() - (7 * 60 * 60 * 1000),
                nodes: cachedNodes
            };
            mockFetchRejects();

            // Act:
            nodesService.loadNetworkNodes().then(result => {
                // Assert:
                expect(result).toBe(cachedNodes);
                expect(mockWallet.nodes).toBe(cachedNodes);
                done();
            });
        });

        it('resolves null when the fetch fails and there is no valid cache', (done) => {
            // Arrange:
            mockFetchRejects();

            // Act:
            nodesService.loadNetworkNodes().then(result => {
                // Assert:
                expect(result).toBeNull();
                expect(mockWallet.nodes).toBeUndefined();
                done();
            });
        });

        it('falls back to the cache when fewer than the minimum nodes survive filtering', (done) => {
            // Arrange:
            const cachedNodes = [{ uri: 'http://a' }, { uri: 'http://b' }, { uri: 'http://c' }];
            mockStorage.nodewatchNodes_testnet = {
                fetchedAt: Date.now() - (7 * 60 * 60 * 1000),
                nodes: cachedNodes
            };
            mockFetchResolves([{ endpoint: 'http://only-one.example.com:7890', height: 1000 }]);

            // Act:
            nodesService.loadNetworkNodes().then(result => {
                // Assert:
                expect(result).toBe(cachedNodes);
                expect(mockWallet.nodes).toBe(cachedNodes);
                done();
            });
        });

        it('resolves null when fewer than the minimum nodes survive filtering and there is no cache', (done) => {
            // Arrange:
            mockFetchResolves([{ endpoint: 'http://only-one.example.com:7890', height: 1000 }]);

            // Act:
            nodesService.loadNetworkNodes().then(result => {
                // Assert:
                expect(result).toBeNull();
                expect(mockWallet.nodes).toBeUndefined();
                done();
            });
        });
    });

    describe('hasFreeSlots', () => {
        it('returns false immediately when no endpoint is given', () => {
            // Act:
            const result = nodesService.hasFreeSlots(null);

            // Assert:
            expect(result).toBe(false);
        });

        it('resolves true when the node has free harvesting slots', (done) => {
            // Arrange:
            const endpoint = { host: 'http://alice.nem.ninja', port: 7890 };
            spyOn(nem.com.requests.account, 'unlockInfo').and.returnValue(
                Promise.resolve({ 'max-unlocked': 5, 'num-unlocked': 3 })
            );

            // Act:
            nodesService.hasFreeSlots(endpoint).then(result => {
                // Assert:
                expect(result).toBe(true);
                done();
            });
        });
    });
});
