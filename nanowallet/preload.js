try {
  window.TransportNodeHid = require("@ledgerhq/hw-transport-node-hid");
  window.isElectronEnvironment = true;
} catch (e) {}
