import { describe, expect, it } from 'vitest';
import { getValueUnder } from './helpers';
import Actor from '../actor'; // updateInventory, // move, // isAdjacent, // init, // getLocation, // getLastDirection, // getInventory,
import { Direction } from '../maze.types';

describe('actor', () => {
    it('should initialize in the indicated location', () => {
        const xStart = getValueUnder(10); // 0-9
        const yStart = getValueUnder(10); // 0-9
        const actor = Actor(yStart, xStart);
        expect(actor.getPosition()).toEqual({ x: xStart, y: yStart });
        expect(actor.getX()).toEqual(xStart);
        expect(actor.getY()).toEqual(yStart);

        const xStart2 = getValueUnder(10); // 0-9
        const yStart2 = getValueUnder(10); // 0-9
        const actor2 = Actor(yStart2, xStart2);

        expect(actor2.getPosition()).toEqual({
            x: xStart2,
            y: yStart2,
        });
        expect(actor.getPosition()).toEqual({ x: xStart, y: yStart });

        expect(actor.getLastDirection()).toBeUndefined();
    });

    // movement

    it('should handle moving north', () => {
        const xStart = getValueUnder(10); // 0-9
        const yStart = getValueUnder(10); // 0-9
        const actor = Actor(yStart, xStart);

        expect(actor.getPosition()).toEqual({ x: xStart, y: yStart });
        expect(actor.getX()).toEqual(xStart);
        expect(actor.getY()).toEqual(yStart);

        actor.moveNorth();

        expect(actor.getPosition()).toEqual({
            x: xStart,
            y: yStart - 1,
        });
        expect(actor.getLastDirection()).toBe(Direction.North);
        expect(actor.isAdjacent(yStart, xStart)).toBeTruthy();
    });

    it('should handle moving south', () => {
        const xStart = getValueUnder(10); // 0-9
        const yStart = getValueUnder(10) + 1; // 1-10
        const actor = Actor(yStart, xStart);

        expect(actor.getPosition()).toEqual({ x: xStart, y: yStart });

        actor.moveSouth();

        expect(actor.getPosition()).toEqual({
            x: xStart,
            y: yStart + 1,
        });
        expect(actor.getLastDirection()).toBe(Direction.South);
        expect(actor.isAdjacent(yStart, xStart)).toBeTruthy();
    });

    it('should handle moving east', () => {
        const xStart = getValueUnder(10); // 0-9
        const yStart = getValueUnder(10); // 0-9
        const actor = Actor(yStart, xStart);

        expect(actor.getPosition()).toEqual({ x: xStart, y: yStart });

        actor.moveEast();

        expect(actor.getPosition()).toEqual({
            x: xStart + 1,
            y: yStart,
        });
        expect(actor.getLastDirection()).toBe(Direction.East);
        expect(actor.isAdjacent(yStart, xStart)).toBeTruthy();
    });

    it('should handle moving west', () => {
        const xStart = getValueUnder(10) + 1; // 1-10
        const yStart = getValueUnder(10); // 0-9
        const actor = Actor(yStart, xStart);

        expect(actor.getPosition()).toEqual({ x: xStart, y: yStart });

        actor.moveWest();

        expect(actor.getPosition()).toEqual({
            x: xStart - 1,
            y: yStart,
        });
        expect(actor.getLastDirection()).toBe(Direction.West);
        expect(actor.isAdjacent(yStart, xStart)).toBeTruthy();
    });

    it('should return expected values for isAdjacent', () => {
        const xStart = getValueUnder(10) + 2; // 2-11
        const yStart = getValueUnder(10) + 2; // 2-11
        const actor = Actor(yStart, xStart);

        expect(actor.isAdjacent(yStart, xStart - 1)).toBeTruthy();
        expect(actor.isAdjacent(yStart, xStart + 1)).toBeTruthy();
        expect(actor.isAdjacent(yStart - 1, xStart)).toBeTruthy();
        expect(actor.isAdjacent(yStart + 1, xStart)).toBeTruthy();

        expect(actor.isAdjacent(yStart, xStart - 2)).toBeFalsy();
        expect(actor.isAdjacent(yStart, xStart + 2)).toBeFalsy();
        expect(actor.isAdjacent(yStart - 2, xStart)).toBeFalsy();
        expect(actor.isAdjacent(yStart + 2, xStart)).toBeFalsy();

        expect(actor.isAdjacent(yStart, xStart - 2, 2)).toBeTruthy();
        expect(actor.isAdjacent(yStart, xStart + 2, 2)).toBeTruthy();
        expect(actor.isAdjacent(yStart - 2, xStart, 2)).toBeTruthy();
        expect(actor.isAdjacent(yStart + 2, xStart, 2)).toBeTruthy();
    });

    it('should move north', () => {
        const xStart = getValueUnder(10) + 2; // 2-11
        const yStart = getValueUnder(10) + 2; // 2-11
        const actor = Actor(yStart, xStart);

        actor.move(Direction.North);

        expect(actor.getPosition()).toEqual({
            x: xStart,
            y: yStart - 1,
        });
        expect(actor.getLastDirection()).toBe(Direction.North);
        expect(actor.isAdjacent(yStart, xStart)).toBeTruthy();
    });

    it('should move south', () => {
        const xStart = getValueUnder(10) + 2; // 2-11
        const yStart = getValueUnder(10) + 2; // 2-11
        const actor = Actor(yStart, xStart);

        actor.move(Direction.South);

        expect(actor.getPosition()).toEqual({
            x: xStart,
            y: yStart + 1,
        });
        expect(actor.getLastDirection()).toBe(Direction.South);
        expect(actor.isAdjacent(yStart, xStart)).toBeTruthy();
    });

    it('should move east', () => {
        const xStart = getValueUnder(10) + 2; // 2-11
        const yStart = getValueUnder(10) + 2; // 2-11
        const actor = Actor(yStart, xStart);

        actor.move(Direction.East);

        expect(actor.getPosition()).toEqual({
            x: xStart + 1,
            y: yStart,
        });
        expect(actor.getLastDirection()).toBe(Direction.East);
        expect(actor.isAdjacent(yStart, xStart)).toBeTruthy();
    });

    it('should move west', () => {
        const xStart = getValueUnder(10) + 2; // 2-11
        const yStart = getValueUnder(10) + 2; // 2-11
        const actor = Actor(yStart, xStart);

        actor.move(Direction.West);

        expect(actor.getPosition()).toEqual({
            x: xStart - 1,
            y: yStart,
        });
        expect(actor.getLastDirection()).toBe(Direction.West);
        expect(actor.isAdjacent(yStart, xStart)).toBeTruthy();
    });
});
