export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function pushUnique<ItemType = unknown>(
    array: Array<ItemType>,
    item: ItemType,
): Array<ItemType> {
    if (array.indexOf(item) === -1) {
        array.push(item);
    }

    return array;
}

export function getUSDTickers(): string[] {
    return ['USD', 'USDT', 'USDC', 'BUSD'];
}

export function isUSDTicker(ticker: string): boolean {
    return getUSDTickers().includes(ticker);
}
