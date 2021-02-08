"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const symbol_sdk_1 = require("symbol-sdk");
const nem_sdk_1 = require("nem-sdk");
const constants_1 = require("../../../../../node_modules/catapult-optin-module/dist/src/constants");
const OptInDTO_1 = require("./OptInDTO");
import LedgerService from '../ledger.service';

class VrfOptinDTOLedger extends OptInDTO_1.OptInDTO {
    constructor(destination, payload, hash) {
        super(OptInDTO_1.OptInDTOType.VRF_DTO_TYPE);
        if (symbol_sdk_1.PublicAccount.createFromPublicKey(destination, symbol_sdk_1.NetworkType.MAIN_NET) == null)
            throw new Error('Invalid destination public key');
        this.destination = destination;
        const vrfTx = symbol_sdk_1.TransactionMapping.createFromPayload(payload);
        if (!(vrfTx instanceof symbol_sdk_1.VrfKeyLinkTransaction))
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
            if (dto.hasOwnProperty('type') && dto.type === OptInDTO_1.OptInDTOType.VRF_DTO_TYPE &&
                dto.hasOwnProperty('destination') &&
                dto.hasOwnProperty('payload') &&
                dto.hasOwnProperty('hash')) {
                return new VrfOptinDTOLedger(dto.destination, dto.payload, dto.hash);
            }
            else
                return null;
        }
        catch (e) {
            return null;
        }
    }
}
exports.VrfOptinDTOLedger = VrfOptinDTOLedger;
/**
 *
 * @param destinationAccount
 * @param vrfAccount
 * @param network
 */
VrfOptinDTOLedger.createLedger = async (destinationAccount, destinationAccountPath, vrfAccount, network) => {
    let signedTransaction;
    const isLedger = destinationAccount.privateKey === undefined;
    const vrfKeyLinkTransaction = symbol_sdk_1.VrfKeyLinkTransaction.create(symbol_sdk_1.Deadline['createFromDTO']('1'), isLedger ? vrfAccount.publicAccount.publicKey : vrfAccount.publicKey, symbol_sdk_1.LinkAction.Link, network);
    if (isLedger) {
        const ledgerService = new LedgerService();
        signedTransaction = await ledgerService.signSymbolTransaction(destinationAccountPath, vrfKeyLinkTransaction, constants_1.OptinConstants[network].CATAPULT_GENERATION_HASH, vrfAccount.publicAccount.publicKey);
    } else {
        signedTransaction = destinationAccount.sign(vrfKeyLinkTransaction, constants_1.OptinConstants[network].CATAPULT_GENERATION_HASH);
    }
    return new VrfOptinDTOLedger(isLedger ? destinationAccount.publicAccount.publicKey : destinationAccount.publicKey, signedTransaction.payload, signedTransaction.hash);
};
