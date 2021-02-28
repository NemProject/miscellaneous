try {
  window.TransportNodeHid = require("@ledgerhq/hw-transport-node-hid-noevents");
  window.isElectronEnvironment = true;
} catch (e) {}
