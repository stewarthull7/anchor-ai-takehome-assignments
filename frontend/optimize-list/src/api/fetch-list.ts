import {sleep, storageKey, generateList} from './utils';


export type ItemData = {
    id: number;
    name: string;
};

export async function fetchList({query}: {query?: string}): Promise<ItemData[]> {
    const storedList = localStorage.getItem(storageKey);
    const list = storedList ? JSON.parse(storedList) : generateList();
    await sleep(500)
    return list.filter((item: {name: string}) => item.name.toLowerCase().includes(query?.toLowerCase() || ''));

}