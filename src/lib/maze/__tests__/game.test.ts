import { beforeEach, describe, expect, it } from 'vitest';

import Game from '../game';
import { type GameConfigMessages, type GameType } from '../maze.types';
import { MONSTER_START } from '../maze.constants';

describe('game', () => {
    let gameInstance: GameType;

    beforeEach(() => {
        gameInstance = Game({
            areas: [],
            gapCols: 0,
            gapRows: 0,
            items: [],
            messages: {} as GameConfigMessages,
            monsterActivationKeyID: '',
        });
    });

    it('should return an object with the correct properties', () => {
        expect(gameInstance).toHaveProperty('canPlayerMoveEast');
        expect(gameInstance).toHaveProperty('canPlayerMoveNorth');
        expect(gameInstance).toHaveProperty('canPlayerMoveSouth');
        expect(gameInstance).toHaveProperty('canPlayerMoveWest');
    });

    it('should render', () => {
        gameInstance = Game({
            areas: [],
            gapCols: 3,
            gapRows: 3,
            items: [],
            messages: {} as GameConfigMessages,
            monsterActivationKeyID: '',
        });
        gameInstance.startGame();
        // check for basics

        const startingInstance = gameInstance.renderMazeRoguelike().split(/\n/);
        const startingMap = gameInstance.getCurrentMap();

        // monster starting spot in top row, not on the edges
        // space below it
        expect(startingMap[0]).toContain(MONSTER_START);
        expect(startingInstance[0]).not.toContain(MONSTER_START);

        // console.log(startingMap);

        // player starting spot on bottom row
        // space above it
        // expect(startingMap[startingMap.length - 1]).toContain(PLAYER_START);
        // expect(startingInstance[0]).not.toContain(PLAYER_START);
    });
    /*
    it('should call startGame function when game is initialized', () => {
        // not sure how to spy on a function returned from a function-object
        const startGameSpy = vi.spyOn(Game, 'startGame');
        gameInstance = Game({
            areas: [],
            gapCols: 0,
            gapRows: 0,
            items: [],
            messages: {},
            monsterActivationKeyID: '',
        });
        expect(startGameSpy).toHaveBeenCalledTimes(1);
    });
 
    it('should update game state when turn count increments', () => {
        const updateGameStateSpy = vi.spyOn(Game, 'updateGameState');
        gameInstance.turnCount++;
        expect(updateGameStateSpy).toHaveBeenCalledTimes(1);
    });

    it('should check for collision and update game state accordingly', () => {
        const checkForCollisionSpy = vi.spyOn(Game, 'checkForCollision');
        gameInstance.player.move(Direction.North);
        expect(checkForCollisionSpy).toHaveBeenCalledTimes(1);
    });

    it('should use item function should return true when item is used successfully', () => {
        const useItemSpy = vi.spyOn(Game, 'useItem');
        gameInstance.player.getInventory().push({ id: 'key' });
        expect(useItemSpy('key')).toBe(true);
    });

    it('should update game message when player is adjacent to an item', () => {
        const updateGameMessageSpy = vi.spyOn(Game, 'updateGameMessage');
        gameInstance.player.move(Direction.North);
        expect(updateGameMessageSpy).toHaveBeenCalledTimes(1);
    });
    */
});
