import Trezor from '../../src/app/modules/trezor/trezor.service';
import { TransactionTypes } from 'nem-library';

describe('Trezor Service', () => {
    let trezorService;
    let mockNemGetAddress;
    let mockNemSignTransaction;
    let mockCipherKeyValue;

    const TESTNET_NETWORK = -104;
    const TESTNET_ADDRESS = 'TA545ICAVNEUDFUBIHO3CEJBSVIZ7YYHFFX5LQPT';
    const MOCK_HD_PATH = "m/44'/1'/0'/0'/0'";

    const createTestAccount = () => ({
        hdKeypath: MOCK_HD_PATH,
        network: TESTNET_NETWORK
    });

    const createTrezorSuccessResponse = payload => Promise.resolve({
        success: true,
        payload
    });

    const createTrezorErrorResponse = () => Promise.resolve({
        success: false,
        payload: { 
            error: 'Trezor error'
        }
    });

    const AssertError = done => (error) => {
        expect(error).toBeDefined();
        done();
    };

    beforeEach(() => {
        spyOn(window.TrezorConnect, 'init');
        mockNemGetAddress = spyOn(window.TrezorConnect, 'nemGetAddress');
        mockNemSignTransaction = spyOn(window.TrezorConnect, 'nemSignTransaction');
        mockCipherKeyValue = spyOn(window.TrezorConnect, 'cipherKeyValue');

        trezorService = new Trezor();
    });

    describe('constructor', () => {
        it('initialize TrezorConnect with correct config', () => {
            // Act + Assert:
            expect(window.TrezorConnect.init).toHaveBeenCalledWith({
                manifest: {
                    email: 'maintainers@nem.io',
                    appUrl: 'https://www.nem.io',
                },
                coreMode: 'popup',
            });
        });
    });

    describe('createWallet', () => {
        it('create a wallet with primary account', (done) => {
            mockNemGetAddress.and.returnValue(
                createTrezorSuccessResponse({ address: TESTNET_ADDRESS })
            );

            trezorService.createWallet(TESTNET_NETWORK)
                .then(result => {
                    expect(result).toEqual({
                        name: 'TREZOR',
                        accounts: {
                            '0': {
                                brain: false,
                                algo: 'trezor',
                                encrypted: '',
                                iv: '',
                                address: TESTNET_ADDRESS,
                                label: 'Primary',
                                network: TESTNET_NETWORK,
                                child: '',
                                hdKeypath: MOCK_HD_PATH
                            }
                        }
                    });
                    done();
                });
        });

        it('rejected when Trezor operation fails', (done) => {
            // Arrange:
            mockNemGetAddress.and.returnValue(
                createTrezorErrorResponse()
            );
            
            // Act + Assert:
            trezorService.createWallet(TESTNET_NETWORK)
                .then(() => {}, AssertError(done));
        });
    });

    describe('deriveRemote', () => {
        it('returns derive remote account', (done) => {
            // Arrange:
            const mockPrivateKey = '0000000000000000000000000000000000000000000000000000000000000000';
            mockCipherKeyValue.and.returnValue(
                createTrezorSuccessResponse({ value: mockPrivateKey })
            );
            
            // Act:
            trezorService.deriveRemote(createTestAccount(), TESTNET_NETWORK)
                .then(result => {
                    // Assert:
                    expect(result).toEqual({
                        address: 'TBONKWCOWBZYZB2I5JD3LSDBQVBYHB757VN3SKPP',
                        privateKey: mockPrivateKey,
                        publicKey: '462ee976890916e54fa825d26bdd0235f5eb5b6a143c199ab0ae5ee9328e08ce'
                    });
                    done();
                });
        });

        it('rejected when Trezor operation fails', (done) => {
            // Arrange:
            mockCipherKeyValue.and.returnValue(
                createTrezorErrorResponse()
            );

            // Act + Assert:
            trezorService.deriveRemote(createTestAccount(), TESTNET_NETWORK)
                .then(() => {}, AssertError(done));
        });
    });

    describe('serialize', () => {
        const createTestTransaction = {
            type: TransactionTypes.TRANSFER,
            amount: 100
        }
        
        it('returns transaction payload', (done) => {
            // Arrange:
            const mockSignature = 'serialize payload';
            mockNemSignTransaction.and.returnValue(
                createTrezorSuccessResponse(mockSignature)
            );

            // Act:
            trezorService.serialize(createTestTransaction, createTestAccount())
                .then(result => {
                    // Assert:
                    expect(result).toBe(mockSignature);
                    done();
                });
        });

        it('rejected when signing fails', (done) => {
            // Arrange:
            mockNemSignTransaction.and.returnValue(
                createTrezorErrorResponse()
            );
            
            // Act + Assert:
            trezorService.serialize(createTestTransaction, createTestAccount())
                .then(() => {}, AssertError(done));
        });
    });

    describe('showAccount', () => {
        it('returns account address', (done) => {
            // Arrange:
            mockNemGetAddress.and.returnValue(
                createTrezorSuccessResponse({ address: TESTNET_ADDRESS })
            );

            // Act:
            trezorService.showAccount(createTestAccount())
                .then(result => {
                    // Assert:
                    expect(result).toBe(TESTNET_ADDRESS);
                    done();
                });
        });

        it('rejected when showing account fails', (done) => {
            // Arrange:
            mockNemGetAddress.and.returnValue(
                createTrezorErrorResponse()
            );

            // Act + Assert:
            trezorService.showAccount(createTestAccount())
                .then(() => {}, AssertError(done));
        });
    });
}); 
