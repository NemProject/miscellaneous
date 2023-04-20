import { fail } from "assert";

describe("Ledger service", function() {

  let LedgerService;

  beforeEach(function() {
     angular.mock.module('app');
  });

  beforeEach(angular.mock.inject(function(_Ledger_) {
    LedgerService = _Ledger_;
  }));

  it ("Has right bip44 path for testnet NetWork", function() {
    // GIVEN
    let expectedResult = "m/44'/1'/0'/0'/0'";

    // WHEN
    let result = LedgerService.bip44(-104, 0);

    // THEN
    expect(expectedResult).toBe(result);
  });

  it ("Has right bip44 path for main NetWork", function() {
    // GIVEN
    let expectedResult = "m/44'/43'/0'/0'/0'";

    // WHEN
    let result = LedgerService.bip44(104, 0);

    // THEN
    expect(expectedResult).toBe(result);
  });

  it ("Can get account from ledger", async function(done) {
    // GIVEN
    let network = -104;
    let index = 0;
    let label = "Primary";
    spyOn(LedgerService, 'getAccount').and.returnValue(Promise.resolve('getAccount() result'));
    let expetedResult = 'getAccount() result';

    // WHEN
    let result = await LedgerService.createAccount(network, index, label)

    // THEN
    expect(LedgerService.getAccount).toHaveBeenCalledWith("m/44'/1'/0'/0'/0'", network, label);
    expect(result).toEqual(expetedResult);
    done();
  });

  it ("Can get wallet from ledger account", async function(done) {
    // GIVEN
    spyOn(LedgerService, 'createAccount').and.returnValue(Promise.resolve('account'));
    let expectedResult = ({
      "name": "LEDGER",
      "accounts": {
          "0": 'account'
      }
    })
    // WHEN
    let result = await LedgerService.createWallet('-109').catch(err => {
      fail('Error while creating wallet: ' + err);
    });
    // THEN
    expect(LedgerService.createAccount).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
    done();
  });

  it ("Can serialize transactions for account", async function(done) {
    // GIVEN
    let transaction = {
      type:257,
      version:-1744830463,
      timeStamp:130922553,
      deadline:130926153,
      recipient:"TA545ICAVNEUDFUBIHO3CEJBSVIZ7YYHFFX5LQPT",
      amount:1000000,
      fee:100000,
      message:{
        type:1,
        payload:"616263"
      },
      mosaics:null
    };
    let account = {
      brain:false,
      algo:"ledger",
      encrypted:"",
      iv:"",
      address:"TA545ICAVNEUDFUBIHO3CEJBSVIZ7YYHFFX5LQPT",
      label:"Primary",
      network:-104,
      child:"",
      hdKeypath:"44'/43'/152'/0'/0'",
      publicKey:"3e6e6cbac488b8a44bdf5abf27b9e1cc2a6f20d09d550a66b9b36f525ca222ee",
      $$hashKey:"object:141"
    };
    spyOn(window, 'alert');
    spyOn(LedgerService, 'signTransaction').and.returnValue(Promise.resolve({ signature: 'signature' }));
    spyOn(LedgerService, 'getAppVersion').and.returnValue(Promise.resolve(1));
    let expectedResult = { signature: 'signature' };

    // WHEN
    let result = await LedgerService.serialize(transaction, account).catch(err => {
      fail('Error while serializing transaction: ' + err);
    });

    // THEN
    expect(LedgerService.signTransaction).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
    done();
  });
});
