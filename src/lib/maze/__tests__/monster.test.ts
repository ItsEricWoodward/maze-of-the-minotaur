import { describe, expect, it } from 'vitest';
import { getValueUnder } from './helpers';
import Monster from '../monster'; // updateInventory, // move, // isAdjacent, // init, // getLocation, // getLastDirection, // getInventory,

describe('monster', () => {
    it('should initialize as expected', () => {
        const startX = getValueUnder(10); // 0-9
        const startY = getValueUnder(10); // 0-9
        const monster = Monster({
            activationKeyID: 'testItem1',
            startX,
            startY,
        });
        expect(monster.getPosition()).toEqual({ x: startX, y: startY });
        expect(monster.getHasBeenActivated()).toBeFalsy();
        expect(monster.getActivationKeyID()).toEqual('testItem1');
    });

    it('should activate monster when matching activation key ID is provided', () => {
        const startX = getValueUnder(10); // 0-9
        const startY = getValueUnder(10); // 0-9
        const monster = Monster({
            activationKeyID: 'testItem2',
            startX,
            startY,
        });
        expect(monster.getPosition()).toEqual({ x: startX, y: startY });
        expect(monster.getHasBeenActivated()).toBeFalsy();
        expect(monster.getActivationKeyID()).toEqual('testItem2');

        expect(monster.activate('testItem2')).toBeTruthy();
        expect(monster.getHasBeenActivated()).toBeTruthy();
    });

    it('should not activate monster when non-matching activation key ID is provided', () => {
        const startX = getValueUnder(10); // 0-9
        const startY = getValueUnder(10); // 0-9
        const monster = Monster({
            activationKeyID: 'testItem2',
            startX,
            startY,
        });
        expect(monster.getPosition()).toEqual({ x: startX, y: startY });
        expect(monster.getHasBeenActivated()).toBeFalsy();
        expect(monster.getActivationKeyID()).toEqual('testItem2');

        expect(monster.activate('testItem1')).toBeFalsy();
        expect(monster.getHasBeenActivated()).toBeFalsy();

        expect(monster.activate('testItem2')).toBeTruthy();
        expect(monster.getHasBeenActivated()).toBeTruthy();
    });
});
