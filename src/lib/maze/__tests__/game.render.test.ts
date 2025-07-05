import { describe, expect, it } from 'vitest';
import { renderInventoryOptions, renderMazeRoguelike } from '../game.render';
import type {
    GameItem,
    MazeType,
    MonsterType,
    PlayerType,
} from '../maze.types';

describe('render', () => {
    describe('renderInventoryOptions', () => {
        it('should return an empty string when inventory is empty', () => {
            const result = renderInventoryOptions([]);
            expect(result).toBe('<option value=""><em>Empty</em></option>');
        });

        it('should join inventory items into a string of HTML options', () => {
            const item1 = { id: 'item1', name: 'Item 1' };
            const item2 = { id: 'item2', name: 'Item 2' };

            const result = renderInventoryOptions([item1, item2] as GameItem[]);
            expect(result).toBe(
                `<option value="item1">Item 1</option>
<option value="item2">Item 2</option>`
            );
        });
    });

    describe('renderMazeRoguelike', () => {
        const maze = {
            getMap: () => [
                [' ', ' ', ' '],
                [' ', 'W', ' '],
                [' ', ' ', ' '],
            ],
            getMapSeen: () => [
                [true, false, true],
                [false, false, false],
                [true, false, true],
            ],
        } as MazeType;

        const monster = {
            getY: () => 0,
            getX: () => 1,
            getHasBeenActivated: () => true,
        } as MonsterType;

        const player = {
            getY: () => 1,
            getX: () => 1,
            isAdjacent: (y, x) => y === player.getY() && x === player.getX(),
        } as PlayerType;

        it('should render the maze as a string of HTML', () => {
            const result = renderMazeRoguelike({
                items: [],
                maze,
                monster,
                player,
            });
            expect(result).toBe(
                `<span style="color: grey">&ensp;</span><span style="color: grey">&#x2591;</span><span style="color: grey">&ensp;</span>
<span style="color: grey">&#x2591;</span><span style="color: yellow">P</span><span style="color: grey">&#x2591;</span>
<span style="color: grey">&ensp;</span><span style="color: grey">&#x2591;</span><span style="color: grey">&ensp;</span>`
            );
        });

        it('should render the maze with items', () => {
            const item = { id: 'item1' };

            const result = renderMazeRoguelike({
                items: [item as GameItem],
                maze,
                monster,
                player,
            });
            expect(result).toBe(
                `<span style="color: grey">&ensp;</span><span style="color: grey">&#x2591;</span><span style="color: grey">&ensp;</span>
<span style="color: grey">&#x2591;</span><span style="color: yellow">P</span><span style="color: grey">&#x2591;</span>
<span style="color: grey">&ensp;</span><span style="color: grey">&#x2591;</span><span style="color: grey">&ensp;</span>`
            );
        });

        it('should render the maze with monster', () => {
            const result = renderMazeRoguelike({
                items: [],
                maze,
                monster,
                player,
            });
            expect(result).toBe(
                `<span style="color: grey">&ensp;</span><span style="color: grey">&#x2591;</span><span style="color: grey">&ensp;</span>
<span style="color: grey">&#x2591;</span><span style="color: yellow">P</span><span style="color: grey">&#x2591;</span>
<span style="color: grey">&ensp;</span><span style="color: grey">&#x2591;</span><span style="color: grey">&ensp;</span>`
            );
        });
    });
});
