/**
 * Replaces the wallet's static NEM node list with a live list fetched from
 * nodewatch.symbol.tools, filtered to currently-active, default-port nodes.
 *
 * Fails safe at every step: any error, timeout, or lack of data leaves the
 * bundled static node list (from nem-sdk inside main.js) fully untouched.
 */
(function () {
  'use strict';

  var NODEWATCH_URLS = {
    mainnet: 'https://nodewatch.symbol.tools/api/nem/nodes',
    testnet: 'https://nodewatch.symbol.tools/testnet/api/nem/nodes'
  };
  var NETWORK_IDS = { mainnet: 104, testnet: -104 };
  var DEFAULT_PORT = 7890;
  var HEIGHT_TOLERANCE = 20;
  var MIN_NODES = 3;
  var FETCH_TIMEOUT_MS = 8000;
  var CACHE_TTL_MS = 6 * 60 * 60 * 1000;
  var CACHE_KEY_PREFIX = 'nemWalletDynamicNodes:v1:';
  var INJECTOR_POLL_MS = 200;
  var INJECTOR_POLL_MAX = 50;
  var PRIVATE_HOST_RE = /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|0\.0\.0\.0$)|^localhost$|^\[?::1\]?$/i;

  function parseEndpoint(raw) {
    var m = /^(https?):\/\/([^:\/\s]+):(\d+)\/?$/i.exec(String(raw || '').trim());
    if (!m) return null;
    return { scheme: m[1].toLowerCase(), hostname: m[2], port: parseInt(m[3], 10) };
  }

  function processNodewatchResponse(json) {
    if (!Array.isArray(json)) return null;

    var candidates = [];
    for (var i = 0; i < json.length; i++) {
      var entry = json[i];
      var ep = entry && parseEndpoint(entry.endpoint);
      if (!ep) continue;
      if (ep.port !== DEFAULT_PORT) continue;
      if (PRIVATE_HOST_RE.test(ep.hostname)) continue;
      if (typeof entry.height !== 'number' || entry.height <= 0) continue;
      candidates.push({ uri: ep.scheme + '://' + ep.hostname, height: entry.height });
    }
    if (!candidates.length) return null;

    var maxHeight = 0;
    for (var j = 0; j < candidates.length; j++) {
      if (candidates[j].height > maxHeight) maxHeight = candidates[j].height;
    }

    var seen = Object.create(null);
    var result = [];
    for (var k = 0; k < candidates.length; k++) {
      var c = candidates[k];
      if ((maxHeight - c.height) > HEIGHT_TOLERANCE) continue;
      var key = c.uri.toLowerCase();
      if (seen[key]) continue;
      seen[key] = true;
      result.push({ uri: c.uri });
    }
    return result;
  }

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

  function getCache(key) {
    try {
      var raw = window.localStorage.getItem(CACHE_KEY_PREFIX + key);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || !Array.isArray(obj.nodes) || typeof obj.fetchedAt !== 'number') return null;
      return obj;
    } catch (e) {
      return null;
    }
  }

  function setCache(key, nodes) {
    try {
      window.localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify({ fetchedAt: Date.now(), nodes: nodes }));
    } catch (e) {
      /* quota exceeded / private mode: non-fatal, just skip caching */
    }
  }

  function loadNetworkNodes(key, url) {
    var cached = getCache(key);
    if (cached && (Date.now() - cached.fetchedAt) < CACHE_TTL_MS && cached.nodes.length >= MIN_NODES) {
      return Promise.resolve(cached.nodes);
    }
    return fetchJsonWithTimeout(url, FETCH_TIMEOUT_MS).then(function (json) {
      var processed = processNodewatchResponse(json);
      if (!processed || processed.length < MIN_NODES) {
        return (cached && cached.nodes.length >= MIN_NODES) ? cached.nodes : null;
      }
      setCache(key, processed);
      return processed;
    }).catch(function () {
      return (cached && cached.nodes.length >= MIN_NODES) ? cached.nodes : null;
    });
  }

  var freshByNetwork = {};
  var appliedArrays = (typeof WeakSet !== 'undefined') ? new WeakSet() : { add: function () {}, has: function () { return false; } };

  function tryApply(injector) {
    try {
      var Wallet = injector.get('Wallet');
      var arr = Wallet.nodes;
      if (!Array.isArray(arr) || appliedArrays.has(arr)) return;

      var key = Wallet.network === NETWORK_IDS.mainnet ? 'mainnet'
        : Wallet.network === NETWORK_IDS.testnet ? 'testnet'
        : null;
      if (!key) return;

      var fresh = freshByNetwork[key];
      if (!fresh || fresh.length < MIN_NODES) return;

      arr.length = 0;
      for (var i = 0; i < fresh.length; i++) arr.push({ uri: fresh[i].uri });
      appliedArrays.add(arr);

      try { injector.get('$rootScope').$applyAsync(); } catch (e) {}
    } catch (e) {
      /* Wallet service missing/renamed, or any other unexpected issue: no-op */
    }
  }

  function onInjectorReady(injector) {
    var rootScope;
    try {
      rootScope = injector.get('$rootScope');
    } catch (e) {
      return;
    }
    tryApply(injector);
    rootScope.$watch(function () {
      try { return injector.get('Wallet').nodes; } catch (e) { return null; }
    }, function () { tryApply(injector); });
  }

  function waitForInjector(attempt) {
    var injector = null;
    try {
      injector = window.angular && angular.element(document).injector();
    } catch (e) {
      injector = null;
    }
    if (injector) { onInjectorReady(injector); return; }
    if (attempt >= INJECTOR_POLL_MAX) return;
    setTimeout(function () { waitForInjector(attempt + 1); }, INJECTOR_POLL_MS);
  }

  Promise.all([
    loadNetworkNodes('mainnet', NODEWATCH_URLS.mainnet).then(function (n) { freshByNetwork.mainnet = n; }),
    loadNetworkNodes('testnet', NODEWATCH_URLS.testnet).then(function (n) { freshByNetwork.testnet = n; })
  ]).then(function () {
    try {
      var injector = window.angular && angular.element(document).injector();
      if (injector) tryApply(injector);
    } catch (e) {}
  }).catch(function () {
    /* both networks failed to load: freshByNetwork stays empty, tryApply keeps no-op'ing */
  });

  waitForInjector(0);
})();
