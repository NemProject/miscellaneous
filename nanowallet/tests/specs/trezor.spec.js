import { fail } from 'assert';
import { TrezorAccount } from '../../src/app/modules/trezor/trezorAccount';

describe('Trezor integration', function () {
    const transaction = {
        type: 257,
        version: -1744830463,
        timeStamp: 130922553,
        deadline: 130926153,
        recipient: 'TA545ICAVNEUDFUBIHO3CEJBSVIZ7YYHFFX5LQPT',
        amount: 1000000,
        fee: 100000,
        message: {
            type: 1,
            payload: '616263',
        },
        mosaics: null,
        setNetworkType: (network) => {
            this.network = network;
        },
        toDTO: () => {},
    };
    const address = 'TA545ICAVNEUDFUBIHO3CEJBSVIZ7YYHFFX5LQPT';
    const hdKeyPath = "44'/43'/152'/0'/0'";
    const network = -104;
    const Trezor = {
        serialize: () => {},
    };

    const testTrezorAccountSignTxs = async (transactions, expectedResults, done) => {
        // Arrange
        const trezorAccount = new TrezorAccount(address, hdKeyPath, network, Trezor);
        spyOn(Trezor, 'serialize').and.returnValues(...expectedResults.map((r) => Promise.resolve(r)));

        let result;

        try {
          if (transactions.length > 1) {
            // Act
            result = await trezorAccount.signTransactions(transactions).toPromise();

            // Assert
            expect(result).toEqual(expectedResults);            
          } else {
            // Act
            result = await trezorAccount.signTransaction(transactions[0]).toPromise();
            
            // Assert
            expect(result).toEqual(expectedResults[0]);
          }  
        } catch (err) {
            fail('Error while serializing transaction for trezor: ' + err);
        }

        // Assert more
        expect(Trezor.serialize).toHaveBeenCalled();
        done();
    };
    it('Can serialize single transaction for trezor account', async function (done) {
        testTrezorAccountSignTxs([transaction], ['payload'], done);
    });

    it('Can serialize multiple transactions for trezor account', async function (done) {
      testTrezorAccountSignTxs([transaction, transaction], ['payload 1', 'payload 2'], done);
    });
});
