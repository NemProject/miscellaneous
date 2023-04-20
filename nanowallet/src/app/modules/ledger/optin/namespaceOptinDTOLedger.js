"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const symbol_sdk_1 = require("symbol-sdk");
const nem_sdk_1 = require("nem-sdk");
const constants_1 = require("catapult-optin-module/dist/src/constants");
const OptInDTO_1 = require("./OptInDTO");
import LedgerService from '../ledger.service';

class NamespaceOptinDTO extends OptInDTO_1.OptInDTO {
    constructor(destination, payload, hash) {
        super(OptInDTO_1.OptInDTOType.NAMESPACE_DTO_TYPE);
        if (symbol_sdk_1.PublicAccount.createFromPublicKey(destination, symbol_sdk_1.NetworkType.MAIN_NET) == null)
            throw new Error('Invalid destination public key');
        this.destination = destination;
        const namespaceTx = symbol_sdk_1.TransactionMapping.createFromPayload(payload);
        if (!(namespaceTx instanceof symbol_sdk_1.NamespaceRegistrationTransaction))
            throw new Error('Invalid payload');
        this.payload = payload;
        this.hash = hash;
    }
    /**
     * Create NamespaceOptinDTO from transaction
     * @param transaction
     */
    static createFromTransaction(transaction) {
        try {
            const message = nem_sdk_1.default.utils.format.hexMessage(transaction.transaction.message);
            const dto = JSON.parse(message);
            if (dto.hasOwnProperty('type') && dto.type === OptInDTO_1.OptInDTOType.NAMESPACE_DTO_TYPE &&
                dto.hasOwnProperty('destination') &&
                dto.hasOwnProperty('payload') &&
                dto.hasOwnProperty('hash')) {
                return new NamespaceOptinDTO(dto.destination, dto.payload, dto.hash);
            }
            else
                return null;
        }
        catch (e) {
            return null;
        }
    }
}
exports.NamespaceOptinDTOLedger = NamespaceOptinDTO;
/**
 *
 * @param destination
 * @param namespace
 * @param network
 */
NamespaceOptinDTO.createLedger = async (destination, destinationPath, namespace, network) => {
    let signedTransaction;
    const isLedger = destination.privateKey === undefined;
    const registerNamespaceTransaction = symbol_sdk_1.NamespaceRegistrationTransaction.createRootNamespace(symbol_sdk_1.Deadline['createFromDTO']('1'), namespace, symbol_sdk_1.UInt64.fromUint(2102400), network);
    if (isLedger) {
        const ledgerService = new LedgerService();
        signedTransaction = await ledgerService.signSymbolTransaction(destinationPath, registerNamespaceTransaction, constants_1.OptinConstants[network].CATAPULT_GENERATION_HASH, destination.publicAccount.publicKey);
    } else {
        signedTransaction = destination.sign(registerNamespaceTransaction, constants_1.OptinConstants[network].CATAPULT_GENERATION_HASH);
    }
    return new NamespaceOptinDTO(isLedger ? destination.publicAccount.publicKey : destination.publicKey, signedTransaction.payload, signedTransaction.hash);
};
