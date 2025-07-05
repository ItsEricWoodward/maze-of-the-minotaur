import { describe, expect, it } from 'vitest';
import Maze from '../maze';

import { getValueUnder } from './helpers';
import { SPACE, WALL } from '../maze.constants';

describe('Maze', () => {
    it('should initialize as expected', () => {
        const maze = Maze(3, 3);
        expect(maze.getMap()).toEqual([
            ['@', '@', '@'],
            ['@', '@', '@'],
            ['@', '@', '@'],
        ]);
        expect(maze.getMapSeen()).toEqual([
            [false, false, false],
            [false, false, false],
            [false, false, false],
        ]);
        expect(maze.getMapVisited()).toEqual([
            [false, false, false],
            [false, false, false],
            [false, false, false],
        ]);
        expect(maze.toString()).toEqual('@@@\n@@@\n@@@');

        const cols2 = getValueUnder(10) + 1; // 1-10
        const rows2 = getValueUnder(10) + 1; // 1-10
        const maze2 = Maze(cols2, rows2);
        expect(maze2.getMap()).toEqual(
            [...Array(cols2)].map(() => [...Array(rows2)].map(() => WALL))
        );
        expect(maze2.getMapSeen()).toEqual(
            [...Array(cols2)].map(() => [...Array(rows2)].map(() => false))
        );
        expect(maze2.getMapVisited()).toEqual(
            [...Array(cols2)].map(() => [...Array(rows2)].map(() => false))
        );
    });

    it('should update maze with setCellValue', () => {
        const maze = Maze(3, 3);
        expect(maze.toString()).toEqual('@@@\n@@@\n@@@');
        expect(maze.valOf(1, 2)).toEqual('@');
        maze.setCellValue(1, 2, 'Z');
        expect(maze.valOf(1, 2)).toEqual('Z');
    });

    it('should update the maze with digStep', () => {
        const maze = Maze(3, 3);
        expect(maze.toString()).toEqual('@@@\n@@@\n@@@');
        maze.digStep(1, 1);

        // too small
        expect(maze.toString()).toEqual('@@@\n@@@\n@@@');

        const maze2 = Maze(9, 9);
        expect(maze2.toString()).toEqual(
            '@@@@@@@@@\n@@@@@@@@@\n@@@@@@@@@\n@@@@@@@@@\n@@@@@@@@@\n@@@@@@@@@\n@@@@@@@@@\n' +
                '@@@@@@@@@\n@@@@@@@@@'
        );

        maze2.digStep(1, 5, true);
        expect(maze2.toString()).not.toEqual(
            '@@@@@@@@@\n@@@@@@@@@\n@@@@@@@@@\n@@@@@@@@@\n@@@@@@@@@\n@@@@@@@@@\n@@@@@@@@@\n' +
                '@@@@@@@@@\n@@@@@@@@@'
        );
        const mazeMap = maze2.getMap();
        expect(mazeMap[0].filter((val) => val === SPACE).length).toEqual(0);
        expect(
            mazeMap[mazeMap.length - 1].filter((val) => val === SPACE).length
        ).toEqual(0);
        mazeMap.forEach((row) => {
            expect(row[0]).toEqual(WALL);
            expect(row[row.length - 1]).toEqual(WALL);
        });
    });

    // test scenarios for placeArea
    it('should place symbol the center when placeArea is called and the center is a wall with a space to south', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        maze.setCellValue(3, 2, ' ');
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@ @@\n@@@@@');
        maze.placeArea({ symbol: 'X', xMin: 0, xMax: 4, yMin: 0, yMax: 4 });
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@X@@\n@@ @@\n@@@@@');
        expect(maze.valOf(2, 2)).toEqual('X');
    });

    it('should place symbol when placeArea is called and x min & max are the same', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        maze.setCellValue(3, 1, ' ');
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@ @@@\n@@@@@');
        maze.placeArea({ symbol: 'X', xMin: 1, xMax: 1, yMin: 0, yMax: 4 });
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@X@@@\n@ @@@\n@@@@@');
        expect(maze.valOf(2, 1)).toEqual('X');
    });

    // TODO: update placeArea to work when y min & max are the same
    it.skip('should place symbol when placeArea is called and y min & max are the same', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        maze.setCellValue(3, 3, ' ');
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@ @\n@@@@@');
        maze.placeArea({ symbol: 'X', xMin: 0, xMax: 4, yMin: 2, yMax: 2 });
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@X@@@\n@ @@@\n@@@@@');
        expect(maze.valOf(2, 1)).toEqual('X');
    });

    it('should do nothing when placeArea is called with the same values for y / x min & max', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        maze.setCellValue(3, 2, ' ');
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@ @@\n@@@@@');
        maze.placeArea({ symbol: 'X', xMin: 0, xMax: 0, yMin: 0, yMax: 0 });
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@ @@\n@@@@@');
    });

    it('should do nothing when placeArea is called with no symbol provided', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        maze.setCellValue(3, 2, ' ');
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@ @@\n@@@@@');
        maze.placeArea({ xMin: 0, xMax: 4, yMin: 0, yMax: 4 });
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@ @@\n@@@@@');
        expect(maze.valOf(3, 2)).toEqual(' ');
    });

    it('should return true for isClearNorth when the cell is to the north clear', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        maze.setCellValue(3, 3, ' ');
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@ @\n@@@@@');
        expect(maze.isClearNorth(4, 3)).toEqual(true);
    });

    it('should return false for isClearNorth when the cell is to the north is blocked', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        expect(maze.isClearNorth(4, 3)).toEqual(false);
    });

    it('should return true for isClearSouth when the cell is to the south clear', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        maze.setCellValue(3, 3, ' ');
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@ @\n@@@@@');
        expect(maze.isClearSouth(2, 3)).toEqual(true);
    });

    it('should return false for isClearSouth when the cell is to the south is blocked', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        expect(maze.isClearSouth(2, 3)).toEqual(false);
    });

    it('should return true for isClearWest when the cell is to the west clear', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        maze.setCellValue(3, 3, ' ');
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@ @\n@@@@@');
        expect(maze.isClearWest(3, 4)).toEqual(true);
    });

    it('should return false for isClearWest when the cell is to the west is blocked', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        expect(maze.isClearWest(3, 4)).toEqual(false);
    });

    it('should return true for isClearEast when the cell is to the east clear', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        maze.setCellValue(3, 3, ' ');
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@ @\n@@@@@');
        expect(maze.isClearEast(3, 2)).toEqual(true);
    });

    it('should return false for isClearEast when the cell is to the east is blocked', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        expect(maze.isClearEast(3, 2)).toEqual(false);
    });

    // markVisited
    it('should mark the cell as visited', () => {
        const maze = Maze(5, 5);
        expect(maze.toString()).toEqual('@@@@@\n@@@@@\n@@@@@\n@@@@@\n@@@@@');
        maze.markVisited(3, 3);
        expect(maze.getMapVisited()).toEqual([
            [false, false, false, false, false],
            [false, false, false, false, false],
            [false, false, false, false, false],
            [false, false, false, true, false],
            [false, false, false, false, false],
        ]);
    });
});
