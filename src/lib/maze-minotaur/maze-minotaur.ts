import Game from '../maze/game';
import {
    ACTIVATION_KEY_ID,
    HORN_MARKER,
    ITEMS,
    MESSAGES,
} from './maze-minotaur.constants';

export default () => {
    const gapCols = 16, // up to 16?
        gapRows = 5;
    const game = Game({
        areas: [
            {
                symbol: HORN_MARKER,
                yMin: gapRows - 4,
                xMin: gapCols - 4,
                yMax: gapRows + 5,
                xMax: gapCols + 5,
                inMessage: MESSAGES.IN_KEY_ROOM,
                nearMessageFragment: MESSAGES.NEAR_KEY_ROOM_FRAGMENT,
            },
        ],
        gapCols,
        gapRows,
        items: ITEMS,
        messages: {
            loseModal: MESSAGES.LOSE_MODAL,
            loseStatus: MESSAGES.LOSE_STATUS,
            monsterAttack: MESSAGES.MONSTER_ATTACK,
            monsterNear: MESSAGES.MONSTER_NEAR,
            welcome: MESSAGES.WELCOME,
            winModal: MESSAGES.WIN_MODAL,
            winStatusFragment: MESSAGES.WIN_STATUS_FRAGMENT,
        },
        monsterActivationKeyID: ACTIVATION_KEY_ID,
    });

    return game;
};
