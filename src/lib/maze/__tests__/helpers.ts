import { ItemType } from '../maze.types';

export const getItems = (xStart: number, yStart: number) => [
    {
        id: 'testItem1',
        isCarried: true,
        name: 'Test Item',
        type: ItemType.Weapon,
        useFailMessage: 'Fail',
        useSuccessMessage: 'Success',
        x: xStart,
        y: yStart,
    },
    {
        id: 'testItem2',
        isCarried: true,
        name: 'Test Item',
        type: ItemType.Weapon,
        useFailMessage: 'Fail',
        useSuccessMessage: 'Success',
        x: xStart,
        y: yStart,
    },
];

export const getValueUnder = (val = 0) => Math.floor(Math.random() * val);
