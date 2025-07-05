import {
    MONSTER_MARKER,
    MONSTER_START,
    PLAYER_MARKER,
    PLAYER_START,
    SPACE,
    WALL,
} from './maze.constants';
import type { GameItem, MazeType, MonsterType, PlayerType } from './maze.types';

export const renderInventoryOptions = (inventory: GameItem[]) => {
    if (inventory.length === 0)
        return `<option value=""><em>Empty</em></option>`;

    return inventory
        .map(({ id, name }) => `<option value="${id}">${name}</option>`)
        .join('\n');
};

const renderSpan = (text: string, color: string) =>
    `<span style="color: ${color}">${text}</span>`;

export const renderMazeRoguelike = ({
    items,
    maze,
    monster,
    player,
}: {
    items: GameItem[];
    maze: MazeType;
    monster: MonsterType;
    player: PlayerType;
}) => {
    const mazeMap = maze.getMap();
    return mazeMap
        .map((row, y) =>
            row.map((originalVal, x) => {
                let val = originalVal;

                const isAdjacent = player.isAdjacent(y, x);

                items.forEach((item) => {
                    const { name: itemName = '' } = item ?? {};
                    if (!itemName.trim() || item.isCarried) return;
                    if (item.y !== y || item.x !== x) return;

                    if (item.id === 'spear') val = '/'; // ↗
                    else if (item.id === 'axe') val = 'T'; // ⛏
                    else if (item.id === 'mouthpiece') val = 'v';
                });

                // player
                if (y === player.getY() && x === player.getX()) {
                    return renderSpan(PLAYER_MARKER, 'yellow');
                }

                if (
                    val === PLAYER_START ||
                    (val === MONSTER_START &&
                        (!monster.getHasBeenActivated() || !isAdjacent))
                )
                    val = WALL;

                if (val === MONSTER_START) {
                    if (monster.getHasBeenActivated() && isAdjacent) {
                        val = SPACE;
                    } else val = WALL;
                }

                // rebuild walls
                // ━ &#x2501;
                // ┃ &#x2503;
                // ┏  &#x250F;
                // ┓  &#2513;
                // ┗ &#2517;
                // ┛ &#251B;
                // ┣ &#2523;
                // ┫ &#252B;
                // ┳ &#2533;
                // ┻  &#253B;
                // 	╋ &#254B;

                if (val === WALL) {
                    let hasWallNorth = false,
                        hasWallSouth = false,
                        hasWallEast = false,
                        hasWallWest = false;
                    if (
                        y > 0 &&
                        (maze.valOf(y - 1, x) === WALL ||
                            (maze.valOf(y - 1, x) === MONSTER_START &&
                                (!isAdjacent ||
                                    !monster.getHasBeenActivated())))
                    )
                        hasWallNorth = true;
                    if (
                        y < mazeMap.length - 1 &&
                        (maze.valOf(y + 1, x) === WALL ||
                            (maze.valOf(y + 1, x) === MONSTER_START &&
                                (!isAdjacent ||
                                    !monster.getHasBeenActivated())))
                    )
                        hasWallSouth = true;
                    if (
                        x > 0 &&
                        (maze.valOf(y, x - 1) === WALL ||
                            (maze.valOf(y, x - 1) === MONSTER_START &&
                                (!isAdjacent ||
                                    !monster.getHasBeenActivated())))
                    )
                        hasWallWest = true;
                    if (
                        x < mazeMap[y].length - 1 &&
                        (maze.valOf(y, x + 1) === WALL ||
                            (maze.valOf(y, x + 1) === MONSTER_START &&
                                (!isAdjacent ||
                                    !monster.getHasBeenActivated())))
                    )
                        hasWallEast = true;

                    if (hasWallNorth) {
                        if (hasWallSouth) {
                            if (hasWallEast) {
                                if (hasWallWest) {
                                    val = '&#x256C;'; // ╬
                                } else {
                                    val = '&#x2560;'; // ╠
                                }
                            } else {
                                if (hasWallWest) {
                                    val = '&#x2563;'; // ╣
                                } else {
                                    val = '&#x2551;'; // ║
                                }
                            }
                        } else {
                            if (hasWallEast) {
                                if (hasWallWest) {
                                    val = '&#x2569;'; // ╩
                                } else {
                                    val = '&#x255A;'; // ╚
                                }
                            } else {
                                if (hasWallWest) {
                                    val = '&#x255D;'; // ╝
                                } else {
                                    val = '&#x2568;'; // ╨
                                }
                            }
                        }
                    } else {
                        if (hasWallSouth) {
                            if (hasWallEast) {
                                if (hasWallWest) {
                                    val = '&#x2566;'; // ╦
                                } else {
                                    val = '&#x2554;'; // ╔
                                }
                            } else {
                                if (hasWallWest) {
                                    val = '&#x2557;'; // ╗
                                } else {
                                    val = '&#x2565;'; // ╥
                                }
                            }
                        } else {
                            if (hasWallEast) {
                                if (hasWallWest) {
                                    val = '&#x2550;'; // ═
                                } else {
                                    val = '&#x255E;'; // ╞
                                }
                            } else {
                                if (hasWallWest) {
                                    val = '&#x2561;'; // ╡
                                } else {
                                    val = '&#x25A1;'; // □
                                }
                            }
                        }
                    }
                }

                // adjacent to player
                if (isAdjacent) {
                    if (
                        monster.getY() === y &&
                        monster.getX() === x &&
                        monster.getHasBeenActivated() &&
                        player.isAdjacent(y, x, 2)
                    )
                        return renderSpan(MONSTER_MARKER, 'red');
                    if (val === MONSTER_START && monster.getHasBeenActivated())
                        return renderSpan(SPACE, 'white');
                    return renderSpan(val, 'white');
                }

                // visited
                if (maze.getMapSeen()[y][x]) return renderSpan(val, 'grey');

                return renderSpan('&#x2591;', 'grey');
            })
        )
        .map((arr) => arr.join(''))
        .join('\n');
};
