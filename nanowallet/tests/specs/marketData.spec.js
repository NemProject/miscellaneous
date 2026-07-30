import { runPromiseErrorTest } from '../helper';

function mockFetch(returnValue, ok = true, status = ok ? 200 : 500) {
    return spyOn(window, 'fetch').and.returnValue(Promise.resolve({
        ok,
        status,
        json: () => Promise.resolve(returnValue),
    }));
}

describe('MarketData service tests', () => {
    let MarketData;
    let $localStorage;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.inject((_MarketData_, _$localStorage_) => {
        MarketData = _MarketData_;
        $localStorage = _$localStorage_;
        $localStorage.$reset();
    }));

    describe('getXemBtcMarketData()', () => {
        it('should map CoinGecko response to Poloniex-shaped market data', async (done) => {
            // Arrange:
            mockFetch({
                nem: {
                    btc: 0.00000123,
                    btc_24h_vol: 456.789,
                    btc_24h_change: 12.34
                }
            });

            // Act:
            const result = await MarketData.getXemBtcMarketData();

            // Assert:
            expect(result).toEqual({
                highestBid: 0.00000123,
                baseVolume: 456.789,
                percentChange: 0.1234
            });
            done();
        });

        it('should throw when the request fails and there is no previous data', async (done) => {
            // Arrange:
            mockFetch(null, false);
            const promiseToTest = MarketData.getXemBtcMarketData();

            // Act + Assert:
            await runPromiseErrorTest(promiseToTest, new Error('CoinGecko request failed with status 500'));
            done();
        });

        it('should throw when the response shape is unexpected', async (done) => {
            // Arrange:
            mockFetch({ nem: {} });
            const promiseToTest = MarketData.getXemBtcMarketData();

            // Act + Assert:
            await runPromiseErrorTest(promiseToTest, new Error('Unexpected CoinGecko response shape'));
            done();
        });

        it('should fall back to the last successfully fetched data when a later request fails', async (done) => {
            // Arrange: seed a previous successful fetch
            mockFetch({
                nem: {
                    btc: 0.000001,
                    btc_24h_vol: 100,
                    btc_24h_change: 1
                }
            });
            await MarketData.getXemBtcMarketData();

            mockFetch(null, false);

            // Act:
            const result = await MarketData.getXemBtcMarketData();

            // Assert:
            expect(result).toEqual({
                highestBid: 0.000001,
                baseVolume: 100,
                percentChange: 0.01
            });
            done();
        });

        it('should always request fresh data instead of short-circuiting on a previous value', async (done) => {
            // Arrange:
            mockFetch({
                nem: {
                    btc: 0.000001,
                    btc_24h_vol: 100,
                    btc_24h_change: 1
                }
            });
            await MarketData.getXemBtcMarketData();

            const fetchSpy = mockFetch({
                nem: {
                    btc: 0.000002,
                    btc_24h_vol: 200,
                    btc_24h_change: 2
                }
            });

            // Act:
            const result = await MarketData.getXemBtcMarketData();

            // Assert:
            expect(fetchSpy).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                highestBid: 0.000002,
                baseVolume: 200,
                percentChange: 0.02
            });
            done();
        });
    });
});
