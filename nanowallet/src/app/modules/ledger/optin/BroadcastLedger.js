"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const symbol_sdk_1 = require("symbol-sdk");
const simpleOptinDTO_1 = require("catapult-optin-module/dist/src/model/simpleOptinDTO");
const namespaceOptinDTO_1 = require("./namespaceOptinDTOLedger");
const vrfOptinDTO_1 = require("./vrfOptinDTOLedger");
const signalOptinDTO_1 = require("catapult-optin-module/dist/src/model/signalOptinDTO");
const convertOptinDTO_1 = require("catapult-optin-module/dist/src/model/convertOptinDTO");
const MultisigCache_1 = require("catapult-optin-module/dist/src/MultisigCache");
const cosigOptinDTO_1 = require("./cosigOptinDTOLedger");

/**
 * Prepares Simple dto
 * @param destination
 */
const buildSimpleDTO = (destination) => __awaiter(void 0, void 0, void 0, function* () {
  return new simpleOptinDTO_1.SimpleOptinDTO(destination.publicKey);
});
exports.buildSimpleDTO = buildSimpleDTO;

/**
 * Prepares Namespace dto
 * @param destination
 * @param namespace
 * @param config
 */
const buildNamespaceDTO = (destination, destinationPath, namespace, config) => __awaiter(void 0, void 0, void 0, function* () {
    return namespaceOptinDTO_1.NamespaceOptinDTOLedger.createLedger(destination, destinationPath, namespace, config.CATNetwork);
});
exports.buildNamespaceDTO = buildNamespaceDTO;

/**
 * Prepares Vrf dto
 * @param destination
 * @param vrfAccount
 * @param config
 */
const buildVrfDTO = (destination, destinationPath, vrfAccount, config) => __awaiter(void 0, void 0, void 0, function* () {
  return vrfOptinDTO_1.VrfOptinDTOLedger.createLedger(destination, destinationPath, vrfAccount, config.CATNetwork);
});

/**
 * Build normal opt in DTOs
 *
 * @param destination
 * @param namespaces
 * @param vrfAccount
 * @param config
 */
const buildNormalOptInDTOsLedger = (destination, destinationPath, namespaces, vrfAccount, config = 0) => __awaiter(void 0, void 0, void 0, function* () {
  const buildDTOs = [];
  buildDTOs.push(buildSimpleDTO(destination.publicAccount));
  for (let namespace of namespaces) {
      buildDTOs.push(yield buildNamespaceDTO(destination, destinationPath, namespace, config));
  }
  if (vrfAccount) {
      buildDTOs.push(yield buildVrfDTO(destination, destinationPath, vrfAccount, config));
  }
  return yield Promise.all(buildDTOs);
});
exports.buildNormalOptInDTOsLedger = buildNormalOptInDTOsLedger;

/**
 * Build Start Multisig Opt in DTOs
 * @param origin
 * @param cosigner
 * @param destination
 * @param namespaces
 * @param config
 */

const buildStartMultisigOptInDTOsLedger = (origin, cosigner, cosignerPath, destination, namespaces, config) => __awaiter(void 0, void 0, void 0, function* () {
  const cache = new MultisigCache_1.MultisigCache(origin, config);
  yield cache.loadFromChain();
  const signalDTO = yield buildSignalDTO(origin, destination.publicAccount);
  cache.signalDTO = signalDTO;
  const namespaceDTOs = [];
  for (let namespace of namespaces) {
      namespaceDTOs.push(yield buildNamespaceDTO(destination, cosignerPath, namespace, config));
  }
  cache.namespaceDTOs = namespaceDTOs;
  const convertDTO = yield buildConvertDTO(origin, destination, config, cache);
  cache.convertDTO = convertDTO;
  const cosignDTO = yield buildCosignDTOLedger(origin, cosigner, cosignerPath, destination.publicAccount, config, cache);
  return [signalDTO, ...namespaceDTOs, convertDTO, cosignDTO];
});
exports.buildStartMultisigOptInDTOsLedger = buildStartMultisigOptInDTOsLedger;

/**
 * Prepares Signal dto
 * @param origin
 * @param destination
 */
const buildSignalDTO = (origin, destination) => __awaiter(void 0, void 0, void 0, function* () {
  return new signalOptinDTO_1.SignalOptinDTO(origin.account.publicKey, destination.publicKey);
});
exports.buildSignalDTO = buildSignalDTO;

/**
 * Prepares Convert dto
 * @param origin
 * @param destination
 * @param config
 * @param cache
 */
const buildConvertDTO = (origin, destination, config, cache) => __awaiter(void 0, void 0, void 0, function* () {
  if (!cache) {
      cache = new MultisigCache_1.MultisigCache(origin, config);
      yield cache.loadFromChain();
  }
  if (!cache.signalDTO) {
      throw new Error('Signal transaction not done yet');
  }
  if (cache.signalDTO.destination !== destination.publicKey) {
      throw new Error('SignalDTO destination is not the same that you are trying to convert');
  }
  const NISCosignerPublicKeys = origin.meta.cosignatories.map(cosignatory => cosignatory.publicKey);
  const cosignersDestinations = cache.cosignersDestinations;
  for (let pubKey of NISCosignerPublicKeys) {
      if (!cosignersDestinations[pubKey]) {
          throw new Error('Some cosignatories are pending to make simple OptIn');
      }
  }
  const cosigners = Object.values(cosignersDestinations)
      .map((pubKey) => symbol_sdk_1.PublicAccount.createFromPublicKey(pubKey, config.CATNetwork));
  const n = origin.account.multisigInfo.minCosignatories;
  const m = origin.account.multisigInfo.cosignatoriesCount;
  let minRemoval;
  if (n == 1 && m == 1) {
      minRemoval = 1;
  }
  else if (n == m) {
      minRemoval = m;
  }
  else if (n < m) {
      minRemoval = m - 1;
  }
  else {
      throw new Error('Invalid n/m values');
  }
  return convertOptinDTO_1.ConvertOptinDTO.create(destination, cosigners, n, minRemoval, config.CATNetwork);
});
exports.buildConvertDTO = buildConvertDTO;

/**
 * Prepares Cosign dto
 * @param origin
 * @param cosigner
 * @param destination
 * @param config
 * @param cache
 */
const buildCosignDTOLedger = (origin, cosigner, cosignerPath, destination, config, cache) => __awaiter(void 0, void 0, void 0, function* () {
  if (!cache) {
      cache = new MultisigCache_1.MultisigCache(origin, config);
      yield cache.loadFromChain();
  }
  if (!cache.signalDTO) {
      throw new Error('Signal transaction not done yet');
  }
  if (cache.signalDTO.destination !== destination.publicKey) {
      throw new Error('SignalDTO destination is not the same that you are trying to cosign');
  }
  if (!cache.convertDTO) {
      throw new Error('No Convert DTO found');
  }
  return cosigOptinDTO_1.CosigOptinDTOLedger.createLedger(cosigner, cosignerPath, cache.convertDTO, destination, config.CATNetwork);
});
exports.buildCosignDTOLedger = buildCosignDTOLedger;

