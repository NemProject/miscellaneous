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
