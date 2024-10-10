
export const storageKey = 'list';
const verbs = [
    'fetch',
    'generate',
    'store',
    'remove',
    'update',
    'delete',
    'create',
    'add',
];

const adjectives = [
    'large',
    'small',
    'tiny',
    'huge',
    'tiny',
    'big',
    'massive',
    'gigantic',
];

const nouns = [
    'list',
    'array',
    'collection',
    'set',
    'group',
    'bunch',
    'batch',
    'bundle',
];

export function genString(){
return `${verbs[Math.floor(Math.random() * verbs.length)]} ${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

export function generateList() {
    const list = Array.from({ length: 15000 }, (_, i) => ({
        id: i,
        name: genString(),
    }));
    localStorage.setItem(storageKey, JSON.stringify(list));
    return list;
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}