import { ItemType, type Item, type KeyItem } from '../maze/maze.types';

export const ACTIVATION_KEY_ID = 'mouthpiece',
    HORN_MARKER = 'H',
    ITEMS: (Item | KeyItem)[] = [
        {
            areaToUse: HORN_MARKER,
            id: 'mouthpiece',
            isCarried: false,
            name: 'Horn Mouthpiece',
            type: ItemType.Key,
            useFailMessage: 'You blow a raspberry into the mouthpiece.',
            useSuccessMessage:
                'The sound of the horn reverberates around the maze. The Minotaur is loosed!',
            x: -1,
            y: -1,
        },
        {
            id: 'axe',
            isCarried: false,
            name: 'Magic Pickaxe',
            type: ItemType.Weapon,
            useFailMessage: 'You swing wildly in the air.',
            useSuccessMessage:
                'You swing with the pickaxe as the Minotaur lunges, ' +
                'stunning him as the weapon explodes.',
            x: -1,
            y: -1,
        },
        {
            id: 'spear',
            isCarried: false,
            name: 'Magic Spear',
            type: ItemType.Weapon,
            useFailMessage: 'You stab wildly at the air.',
            useSuccessMessage:
                'You stab with the spear as the Minotaur lunges, ' +
                'stunning him as the weapon explodes.',
            x: -1,
            y: -1,
        },
    ],
    MESSAGES = {
        IN_KEY_ROOM:
            'You are in an empty room with a large horn. It appears to be missing its mouthpiece.',
        NEAR_KEY_ROOM_FRAGMENT: 'A large horn sits in a room to the',
        LOSE_STATUS: 'The Minotaur gored you. YOU HAVE DIED!',
        LOSE_MODAL: 'You Have Died!',
        MONSTER_ATTACK: 'The Minotaur lunges after you.',
        MONSTER_NEAR: "You hear the Minotaur's heavy steps and breathing.",
        WELCOME: 'Welcome to the Maze of the Minotaur!',
        WIN_STATUS_FRAGMENT: 'You escaped the Minotaur in ',
        WIN_MODAL: 'You Have Won!',
    };
