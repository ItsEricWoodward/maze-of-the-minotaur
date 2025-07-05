import Debug from 'debug';
const debug = Debug('Maze');

import { MONSTER_MARKER, SPACE, WALL } from './maze.constants';

export default (rows: number, cols: number) => {
    const occupiedSpaces = [MONSTER_MARKER, WALL];

    const map = [...Array(rows)].map(() => [...Array(cols)].map(() => WALL));
    const mapVisited = map.map((row) => row.map(() => false));
    const mapSeen = map.map((row) => row.map(() => false));

    const toString = () => map.map((row) => row.join('')).join('\n');

    const digStep = (row = 0, col = 0, noZero = false) => {
        let i = 0;
        const vector = [
            [0, 0],
            [0, 0],
            [0, 0],
        ]; /* 3 possible directions */
        const updateVectorRow = (val: number, idx: number) => {
            vector[idx][0] = val;
        };
        const getVectorRow = (idx: number) => vector[idx][0];
        const updateVectorCol = (val: number, idx: number) =>
            (vector[idx][1] = val);
        const getVectorCol = (idx: number) => vector[idx][1];

        while (true) {
            i = 0; /* create a list of possible options */
            if (row > 2 && map[row - 2][col] === WALL) {
                updateVectorRow(row - 2, i);
                updateVectorCol(col, i);
                i++;
            }
            if (row < map.length - 3 && map[row + 2][col] === WALL) {
                updateVectorRow(row + 2, i);
                updateVectorCol(col, i);
                i++;
            }
            if (col > 2 && map[row][col - 2] === WALL) {
                updateVectorRow(row, i);
                updateVectorCol(col - 2, i);
                i++;
            }
            if (col < map[row].length - 3 && map[row][col + 2] === WALL) {
                updateVectorRow(row, i);
                updateVectorCol(col + 2, i);
                i++;
            }

            if (i === 0) break; // dead end
            let r = Math.floor(Math.random() * i); // random direction
            while (r === 0 && noZero) {
                r = Math.floor(Math.random() * i); // bypass an error
            }
            map[getVectorRow(r)][getVectorCol(r)] = SPACE;
            map[(getVectorRow(r) + row) / 2][(getVectorCol(r) + col) / 2] =
                SPACE;

            // debug(`step: \n${toString()}`);

            digStep(getVectorRow(r), getVectorCol(r));
        }
    };

    const placeArea = ({
        symbol = '',
        xMax = 0,
        xMin = 0,
        yMax = 0,
        yMin = 0,
    }) => {
        debug(`placeArea: starting`);
        if (symbol === '' || (yMax === yMin && xMax === xMin)) return;
        const x = Math.floor((xMax - xMin) / 2) + xMin;
        const y = Math.floor((yMax - yMin) / 2) + yMin;

        debug(`placeArea: checking first ${x}, ${y}`);
        if (
            map[y][x] === WALL &&
            map[y + 1][x] === SPACE &&
            map[y][x - 1] === WALL &&
            map[y][x + 1] === WALL
        ) {
            map[y][x] = symbol;
            return;
        }

        let xNew = x;
        do {
            let yNew = y - 1;
            debug(`placeArea: checking ${xNew}, ${yNew}`);
            while (yNew !== y) {
                if (
                    map[yNew][xNew] === WALL &&
                    map[yNew + 1][xNew] === SPACE &&
                    map[yNew][xNew - 1] === WALL &&
                    map[yNew][xNew + 1] === WALL
                ) {
                    debug(`placeArea: found at ${xNew}, ${yNew}`);
                    map[yNew][xNew] = symbol;
                    return;
                }
                if (yNew <= yMin) yNew = Math.min(yMax, map.length - 2);
                else yNew--;
            }
            if (xNew === xMin) xNew = Math.min(xMax, map[y].length - 2);
            else xNew--;
        } while (xNew !== x);
    };

    const markVisited = (y = -1, x = -1) => {
        if (x == -1 || y === -1) return;

        debug(`markVisited: marking ${x}, ${y}`);
        mapVisited[y][x] = true;
        if (y > 0) {
            if (x > 0) {
                mapSeen[y - 1][x - 1] = true;
                mapSeen[y - 1][x] = true;
                mapSeen[y][x - 1] = true;
                mapSeen[y][x] = true;
                if (y < mapVisited.length - 1) {
                    mapSeen[y + 1][x - 1] = true;
                    mapSeen[y + 1][x] = true;
                }
                if (x < mapVisited[y].length - 1) {
                    mapSeen[y - 1][x + 1] = true;
                    mapSeen[y][x + 1] = true;
                    if (y < mapVisited.length - 1) {
                        mapSeen[y + 1][x + 1] = true;
                    }
                }
            }
        }
    };

    const getEmptyCellArray = () =>
        map.reduce(
            (acc: { x: number; y: number }[], row, y) =>
                acc.concat(
                    row
                        .map((val, x) => (val === SPACE ? { x, y } : null))
                        .filter((val) => val !== null)
                ),
            []
        );

    return {
        digStep,
        getEmptyCellArray,

        getMap: () => map,
        getMapSeen: () => mapSeen,
        getMapVisited: () => mapVisited,

        isClearNorth: (y: number, x: number) =>
            y > 0 && !occupiedSpaces.includes(map[y - 1][x]),
        isClearSouth: (y: number, x: number) =>
            y < map.length - 1 && !occupiedSpaces.includes(map[y + 1][x]),
        isClearEast: (y: number, x: number) =>
            x < map[y].length - 1 && !occupiedSpaces.includes(map[y][x + 1]),
        isClearWest: (y: number, x: number) =>
            x > 0 && !occupiedSpaces.includes(map[y][x - 1]),

        markVisited,
        placeArea,
        setCellValue: (y = -1, x = -1, value = '') => {
            if (x === -1 || y === -1 || value === '') return;
            return (map[y][x] = value);
        },
        toString,
        valOf: (y = -1, x = 1) => {
            if (y < 0 || x < 0 || y >= map.length || x >= map[y].length) return;

            return map[y][x];
        },
    };
};
