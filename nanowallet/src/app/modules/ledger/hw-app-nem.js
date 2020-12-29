import BIPPath from "bip32-path";

/**
 * NEM API
 *
 * @example
 * import Nem from "@ledgerhq/hw-app-nem";
 * const nem = new Nem(transport);
   recognize networkId by bip32Path;
      "44'/43'/networkId'/walletIndex'/accountIndex'"

   const bip32path_mijin_testnet = "44'/43'/144'/1'/2'"
   const bip32path_mijin_mainnet "44'/43'/96'/3'/1'"
   const bip32path_nem_mainnet = "44'/43'/104'/5'/1'"

 */

const MAX_CHUNK_SIZE = 255;
const CLA_FIELD = 0xe0

export default class Nem {

    constructor(transport, scrambleKey = "NEM") {
        this.transport = transport;
        transport.decorateAppAPIMethods(this,
            ["getAppVersion", "getAddress", "signTransaction"],
            scrambleKey);
    }

    /**
     * get the version of the NEM app installed on the hardware device
     *
     * @return an object with a version
     * @example
     * const result = await nem.getAppVersion();
     *
     * {
     *   "majorVersion": "0",
     *   "minorVersion": "0",
     *   "patchVersion": "2"
     * }
     */
    async getAppVersion() {
        // APDU fields configuration
        const apdu = {
            cla: 0xe0,
            ins: 0x06,
            p1: 0x00,
            p2: 0x00,
            data: Buffer.alloc(1, 0x00, 'hex'),
        };
        // Response from Ledger
        const response = await this.transport.send(apdu.cla, apdu.ins, apdu.p1, apdu.p2, apdu.data);
        const result = {
            majorVersion: '',
            minorVersion: '',
            patchVersion: '',
        };
        result.majorVersion = response[1];
        result.minorVersion = response[2];
        result.patchVersion = response[3];
        return result;
    }

    /**
     * get NEM address for a given BIP 32 path.
     *
     * @param path a path in BIP 32 format
     * @param display optionally enable or not the display
     * @param chainCode optionally enable or not the chainCode request
     * @param ed25519
     * @return an object with a publicKey, address and (optionally) chainCode
     * @example
     * const result = await nem.getAddress(bip32path);
     * const { publicKey, address } = result;
     */
    async getAddress(path) {
        const GET_ADDRESS_INS_FIELD = 0x02
        const display = true;
        const chainCode = false;
        const ed25519 = true;

        const bipPath = BIPPath.fromString(path).toPathArray();
        const curveMask = ed25519 ? 0x80 : 0x40;

        // APDU fields configuration
        const apdu = {
            cla: CLA_FIELD,
            ins: GET_ADDRESS_INS_FIELD,
            p1: display ? 0x01 : 0x00,
            p2: curveMask | (chainCode ? 0x01 : 0x00),
            data: Buffer.alloc(1 + bipPath.length * 4),
        };

        apdu.data.writeInt8(bipPath.length, 0);
        bipPath.forEach((segment, index) => {
            apdu.data.writeUInt32BE(segment, 1 + index * 4);
        });

        // Response from Ledger
        const response = await this.transport.send(apdu.cla, apdu.ins, apdu.p1, apdu.p2, apdu.data);

        const result = {};
        const addressLength = response[0];
        const publicKeyLength = response[1 + addressLength];
        result.address = response.slice(1, 1 + addressLength).toString("ascii");
        result.publicKey = response.slice(1 + addressLength + 1, 1 + addressLength + 1 + publicKeyLength).toString("hex");
        result.path = path;
        return result;
    }

    /**
     * sign a NEM transaction with a given BIP 32 path
     *
     * @param path a path in BIP 32 format
     * @param rawTxHex a raw transaction hex string
     * @return a signature as hex string
     * @example
     * const signature = await nem.signTransaction(bip32path, "0390544100000000000000008A440493150000009029ECB35BFB8D51833381AA7947B9A4A21BA83712F338054B190001005369676E2066726F6D204C6564676572204E616E6F20532E44B262C46CEABB852823000000000000");
     */
    async signTransaction(path, rawTxHex) {
        const TX_INS_FIELD = 0x04;
        const bipPath = BIPPath.fromString(path).toPathArray();
        const rawTx = Buffer.from(rawTxHex, "hex");

        const chainCode = false;
        const ed25519 = true;

        const curveMask = ed25519 ? 0x80 : 0x40;

        const apdus = [];
        let offset = 0;

        while (offset !== rawTx.length) {
            const maxChunkSize = offset === 0 ? MAX_CHUNK_SIZE - 1 - bipPath.length * 4 : MAX_CHUNK_SIZE;
            const chunkSize = offset + maxChunkSize > rawTx.length ? rawTx.length - offset : maxChunkSize;
            // APDU fields configuration
            const apdu = {
                cla: CLA_FIELD,
                ins: TX_INS_FIELD,
                p1: offset === 0 ? (chunkSize < maxChunkSize ? 0x00 : 0x80) : chunkSize < maxChunkSize ? 0x01 : 0x81,
                p2: curveMask | (chainCode ? 0x01 : 0x00),
                data: offset === 0 ? Buffer.alloc(1 + bipPath.length * 4 + chunkSize) : Buffer.alloc(chunkSize)
            };

            if (offset === 0) {
                apdu.data.writeInt8(bipPath.length, 0);
                bipPath.forEach((segment, index) => {
                    apdu.data.writeUInt32BE(segment, 1 + index * 4);
                });
                rawTx.copy(apdu.data, 1 + bipPath.length * 4, offset, offset + chunkSize);
            } else {
                rawTx.copy(apdu.data, 0, offset, offset + chunkSize);
            }
            apdus.push(apdu);
            offset += chunkSize;
        }

        let response = Buffer.alloc(0);
        for (let apdu of apdus) {
            response = await this.transport.send(apdu.cla, apdu.ins, apdu.p1, apdu.p2, apdu.data);
        }
        // if (response.toString() != CONTINUE_SENDING) {
        //     console.log("handle ok")
        //     h = response.toString("hex");
        // }


        // the last 2 bytes are status code from the hardware
        //return response.slice(0, response.length - 2).toString("hex");

        let h = response.toString("hex");

        return {
            signature: h.slice(0, 128),
            publicKey: rawTxHex.slice(32, 96),
            path: path
        };
    }
}
