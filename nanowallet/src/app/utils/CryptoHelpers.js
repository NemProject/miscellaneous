/** @module utils/CryptoHelpers */

import BIP32Provider from './bip32';
import nem from 'nem-sdk';

/**
 * Generate bip32 data
 *
 * @param {string} r - A private key
 * @param {string} password - A wallet password
 * @param {number} index - A derivation index
 * @param {number} network - A network id
 *
 * @return {object|promise} - The bip32 data or promise error
 */
let generateBIP32Data = function(r, password, index, network) {
    return new Promise((resolve, reject) => {

        if (!r) return reject("No private key");
        if (!password) return reject("No password");
        if (!network) return reject("No network");

        // 25000 rounds of SHA3
        let pk_SHA3_25000;
        for (let i = 0; i < 25000; ++i) {
            pk_SHA3_25000 = nem.crypto.js.SHA3(r, {
                outputLength: 256
            });
        }
        let hmac = nem.crypto.js.algo.HMAC.create(nem.crypto.js.algo.SHA3, password);
        hmac.update(pk_SHA3_25000);
        let hash = hmac.finalize();

        // Split into equal parts of 32 bytes
        let il = Crypto.util.hexToBytes(hash.toString().slice(0, 64));
        let ir = Crypto.util.hexToBytes(hash.toString().slice(64, 128));

        /*console.log("Private: " + r.toString());
        console.log("Hash: " + hash.toString());
        console.log("il: " + il.toString());
        console.log("ir: " + ir.toString());*/

        // Create BIP32 object
        let gen_bip32 = new BIP32Provider.BIP32();
        try {
            // Set BIP32 object properties
            gen_bip32.eckey = new Bitcoin.ECKey(il);
            gen_bip32.eckey.pub = gen_bip32.eckey.getPubPoint();
            gen_bip32.eckey.setCompressed(true);
            gen_bip32.eckey.pubKeyHash = Bitcoin.Util.sha256ripe160(gen_bip32.eckey.pub.getEncoded(true));
            gen_bip32.has_private_key = true;

            gen_bip32.chain_code = ir;
            gen_bip32.child_index = 0;
            gen_bip32.parent_fingerprint = Bitcoin.Util.hexToBytes("00000000");
            // BIP32 version by wallet network
            if (network === nem.model.network.data.mainnet.id) {
                gen_bip32.version = 0x68000000;
            } else if (network === nem.model.network.data.mijin.id) {
                gen_bip32.version = 0x60000000;
            } else {
                gen_bip32.version = 0x98000000;
            }
            gen_bip32.depth = 99;

            gen_bip32.build_extended_public_key();
            gen_bip32.build_extended_private_key();
        } catch (err) {
            return reject(err);
        }

        //console.log('BIP32 Extended Key: ' + gen_bip32.extended_private_key_string("base58"));

        updateDerivationPath(gen_bip32, index, network, resolve, reject);
    });
};

function updateDerivationPath(bip32_source_key, index, network, resolve, reject) {
    let bip32_derivation_path = "m/i"; //Simple

    //k set to 0, only using the i'th KeyPair
    updateResult(bip32_source_key, bip32_derivation_path, 0, index, network, resolve, reject);
}

function updateResult(bip32_source_key, bip32_derivation_path, k_index, i_index, network, resolve, reject) {
    let p = '' + bip32_derivation_path;
    let k = parseInt(k_index);
    let i = parseInt(i_index);

    p = p.replace('i', i).replace('k', k);

    let result;
    try {
        if (bip32_source_key == null) {
            return reject("Error state set on the source key")
        }
        //console.log("Deriving: " + p);
        result = bip32_source_key.derive(p);
    } catch (err) {
        return reject(err);
    }

    if (result.has_private_key) {
        //console.log('Derived private key: ' + result.extended_private_key_string("base58"));
        //console.log('Derived private key HEX: ' + Crypto.util.bytesToHex(result.eckey.priv.toByteArrayUnsigned()));
        let privkeyBytes = result.eckey.priv.toByteArrayUnsigned();
        while (privkeyBytes.length < 32) {
            privkeyBytes.unshift(0);
        };
    } else {
        return reject("No private key available");
    }

    let account = nem.crypto.keyPair.create(nem.utils.helpers.fixPrivateKey(Crypto.util.bytesToHex(result.eckey.priv.toByteArrayUnsigned())));
    let address = nem.model.address.toAddress(account.publicKey.toString(), network);
    console.log('BIP32 account generated: ' + address);

    return resolve({
        seed: bip32_source_key.extended_private_key_string("base58"),
        address: address,
        privateKey: nem.utils.helpers.fixPrivateKey(Crypto.util.bytesToHex(result.eckey.priv.toByteArrayUnsigned())),
        publicKey: account.publicKey.toString()
    });
}

/**
 * Derive a bip32 account from seed
 *
 * @param {string} bip32Key - A bip32 seed
 * @param {number} index - A derivation index
 * @param {number} network - A network id
 *
 * @return {object|promise} - The bip32 data or promise error
 */
let BIP32derivation = function(bip32Key, index, network) {
    return new Promise((resolve, reject) => {

        if (!bip32Key) {
            return reject("No seed to derivate account from");
        }

        let bip32_source_key;
        try {
            // Create bip32 object from seed
            let source_key_str = bip32Key;
            if (source_key_str.length == 0) return;
            bip32_source_key = new BIP32Provider.BIP32(source_key_str);
        } catch (err) {
            bip32_source_key = null;
            return reject(err)
        }

        updateDerivationPath(bip32_source_key, index, network, resolve, reject);
    });
};

module.exports = {
    generateBIP32Data,
    BIP32derivation
}