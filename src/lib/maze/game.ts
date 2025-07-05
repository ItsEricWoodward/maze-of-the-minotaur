import {
    Direction,
    ItemType,
    type GameConfig,
    type KeyItem,
    type MazeType,
    type MonsterType,
    type PlayerType,
} from './maze.types';
import Player from './player';
import Monster from './monster';
import Maze from './maze';
import { MONSTER_START, PLAYER_START, SPACE, WALL } from './maze.constants';
import { renderInventoryOptions, renderMazeRoguelike } from './game.render';

const startsWithVowel = (value: string) =>
    ['a', 'e', 'i', 'o', 'u'].includes(
        (value ?? [' ']).charAt(0).toLocaleLowerCase()
    );

export default ({
    areas,
    gapCols = 0,
    gapRows = 0,
    items: originalItems,
    messages,
    monsterActivationKeyID,
}: GameConfig) => {
    const {
        loseModal: loseModalMessage = 'You Lose!',
        loseStatus: loseStatusMessage = 'You lose!',
        monsterAttack: monsterAttackMessage = 'The monster attacks!',
        monsterNear:
            monsterNearMessage = 'You hear the monster breathing nearby.',
        welcome: welcomeMessage = 'Welcome to the Maze of Doom!',
        winModal: winModalMessage = '',
        winStatusFragment: winStatusMessageFragment = '',
    } = messages ?? {};
    let gameMessage = welcomeMessage,
        isRunning = false,
        items: GameConfig['items'],
        maze: MazeType,
        modalMessage = '',
        monster: MonsterType,
        player: PlayerType,
        turnCount: number;

    const canPlayerMoveNorth = () =>
            maze.isClearNorth(player.getY(), player.getX()),
        canPlayerMoveSouth = () =>
            maze.isClearSouth(player.getY(), player.getX()),
        canPlayerMoveEast = () =>
            maze.isClearEast(player.getY(), player.getX()),
        canPlayerMoveWest = () =>
            maze.isClearWest(player.getY(), player.getX()),
        checkForCollision = () => {
            const playerX = player.getX(),
                playerY = player.getY(),
                monsterX = monster.getX(),
                monsterY = monster.getY();
            // if no player / monster collision, done
            if (!(playerY === monsterY && playerX === monsterX)) return;

            const weapons = player
                .getInventory()
                .filter(({ type }) => type === ItemType.Weapon);

            // check for weapons
            if (weapons.length) {
                const theWeapon = weapons[0];

                gameMessage = theWeapon.useSuccessMessage;
                player.expendItem(theWeapon.id);
                items[
                    items.findIndex(({ id }) => id === theWeapon.id)
                ].hasBeenUsed = true;

                // move away from the minotaur
                for (let i = 0; i < 3; i++) {
                    const directionOptions: Direction[] = [],
                        lastDirection = player.getLastDirection(),
                        newX = player.getX(),
                        newY = player.getY();

                    if (i === 0) {
                        if (
                            lastDirection !== Direction.North &&
                            maze.isClearNorth(newY, newX)
                        )
                            directionOptions.push(Direction.North);
                        if (
                            lastDirection !== Direction.South &&
                            maze.isClearSouth(newY, newX)
                        )
                            directionOptions.push(Direction.South);
                        if (
                            lastDirection !== Direction.East &&
                            maze.isClearEast(newY, newX)
                        )
                            directionOptions.push(Direction.East);
                        if (
                            lastDirection !== Direction.West &&
                            maze.isClearWest(newY, newX)
                        )
                            directionOptions.push(Direction.West);
                    } else {
                        // prefer to keep running in that direction
                        if (
                            lastDirection === Direction.North &&
                            maze.isClearNorth(newY, newX) &&
                            maze.valOf(newY - 1, newX) !== MONSTER_START
                        )
                            directionOptions.push(Direction.North);
                        if (
                            lastDirection === Direction.South &&
                            maze.isClearSouth(newY, newX)
                        )
                            directionOptions.push(Direction.South);
                        if (
                            lastDirection === Direction.East &&
                            maze.isClearEast(newY, newX)
                        )
                            directionOptions.push(Direction.East);
                        if (
                            lastDirection === Direction.West &&
                            maze.isClearWest(newY, newX)
                        )
                            directionOptions.push(Direction.West);

                        // don't go backwards
                        if (
                            lastDirection !== Direction.South &&
                            maze.isClearNorth(newY, newX)
                        )
                            directionOptions.push(Direction.North);
                        if (
                            lastDirection !== Direction.North &&
                            maze.isClearSouth(newY, newX)
                        )
                            directionOptions.push(Direction.South);
                        if (
                            lastDirection !== Direction.West &&
                            maze.isClearEast(newY, newX)
                        )
                            directionOptions.push(Direction.East);
                        if (
                            lastDirection !== Direction.East &&
                            maze.isClearWest(newY, newX)
                        )
                            directionOptions.push(Direction.West);
                    }

                    if (directionOptions.length) {
                        player.move(
                            directionOptions[
                                Math.floor(
                                    Math.random() * directionOptions.length
                                )
                            ]
                        );
                    }
                }
            } else {
                isRunning = false;
                gameMessage = loseStatusMessage;
                modalMessage = loseModalMessage;
            }
        },
        checkForWin = () => {
            if (
                maze.valOf(player.getY(), player.getX()) === MONSTER_START &&
                monster.getHasBeenActivated()
            ) {
                isRunning = false;
                gameMessage = `${winStatusMessageFragment} ${turnCount} turns. YOU HAVE WON!`;
                modalMessage = winModalMessage;
            }
            return !isRunning;
        },
        collectItems = () => {
            const playerX = player.getX(),
                playerY = player.getY();
            // items
            items = items.map((item) => {
                if (
                    !item.isCarried &&
                    item.y === playerY &&
                    item.x === playerX
                ) {
                    gameMessage = `You picked up a ${item.name}!`;

                    return {
                        ...item,
                        isCarried: true,
                    };
                }
                return item;
            });

            player.updateInventory(
                items
                    .filter(
                        ({ hasBeenUsed = false, isCarried }) =>
                            isCarried && !hasBeenUsed
                    )
                    .map(({ ...props }) => ({
                        ...props,
                        x: playerX,
                        y: playerY,
                    }))
            );
        },
        movePlayerAndUpdate = (direction: Direction) => {
            if (!isRunning) return;

            player.move(direction);
            maze.markVisited(player.getY(), player.getX());
            updateGameState();
        },
        movePlayerNorth = () =>
            canPlayerMoveNorth() && movePlayerAndUpdate(Direction.North),
        movePlayerSouth = () =>
            canPlayerMoveSouth() && movePlayerAndUpdate(Direction.South),
        movePlayerEast = () =>
            canPlayerMoveEast() && movePlayerAndUpdate(Direction.East),
        movePlayerWest = () =>
            canPlayerMoveWest() && movePlayerAndUpdate(Direction.West),
        placeAreas = (areas: GameConfig['areas']) =>
            areas.forEach((area) => maze.placeArea(area)),
        placeItems = (itemsToPlace: GameConfig['items']) => {
            let emptyCells = maze.getEmptyCellArray();
            items = Array.from(itemsToPlace).map((item) => {
                const randomIndex = Math.floor(
                    Math.random() * emptyCells.length
                );
                const { x, y } = emptyCells[randomIndex];
                emptyCells = emptyCells.filter((_, idx) => idx !== randomIndex);
                return {
                    ...item,
                    x,
                    y,
                };
            });
        },
        pickMonsterDirection = () => {
            const aggressionFactor = Math.random() * 3,
                monsterY = monster.getY(),
                monsterX = monster.getX(),
                playerY = player.getY(),
                playerX = player.getX();

            // if player is within 2 spaces and the path is clear between them,
            // move that direction
            if (
                player.isAdjacent(monsterY, monsterX, 2) ||
                aggressionFactor > 1
            ) {
                if (
                    monsterY < playerY &&
                    maze.valOf(monsterY + 1, monsterX) === SPACE
                )
                    return Direction.South;
                if (
                    monsterY > playerY &&
                    maze.valOf(monsterY - 1, monsterX) === SPACE
                )
                    return Direction.North;
                if (
                    monsterX < playerX &&
                    maze.valOf(monsterY, monsterX + 1) === SPACE
                )
                    return Direction.East;
                else if (
                    monsterX > playerX &&
                    maze.valOf(monsterY, monsterX - 1) === SPACE
                )
                    return Direction.West;
            }

            // determine random direction based on available spaces
            const directionOptions: (Direction | null)[] = [null];
            if (maze.isClearNorth(monsterY, monsterX))
                directionOptions.push(Direction.North);
            if (maze.isClearSouth(monsterY, monsterX))
                directionOptions.push(Direction.South);
            if (maze.isClearEast(monsterY, monsterX))
                directionOptions.push(Direction.East);
            if (maze.isClearWest(monsterY, monsterX))
                directionOptions.push(Direction.West);

            return directionOptions[
                Math.floor(Math.random() * directionOptions.length)
            ];
        },
        startGame = () => {
            const monsterCol =
                Math.floor(Math.random() * (gapCols * 2 - 4)) + 2;
            let playerCol = Math.floor(Math.random() * (gapCols * 2 - 1) + 1);

            maze = Maze(gapRows * 2 + 1, gapCols * 2 + 1);
            maze.digStep(1, monsterCol, true);

            monster = Monster({
                activationKeyID: monsterActivationKeyID,
                startX: monsterCol,
                startY: 0,
            });
            maze.setCellValue(0, monsterCol, MONSTER_START);

            placeAreas(areas);
            placeItems(originalItems);

            player = Player(gapRows * 2, playerCol);
            if (!maze.isClearNorth(player.getY(), player.getX())) {
                maze.setCellValue(gapRows * 2, playerCol, WALL);
                while (maze.valOf(gapRows * 2 - 1, playerCol) !== SPACE) {
                    if (playerCol < 2) playerCol = maze.getMap()[0].length - 3;
                    else playerCol = playerCol - 1;
                }
                maze.setCellValue(gapRows * 2, playerCol, PLAYER_START);
                player = Player(gapRows * 2, playerCol);
            }

            turnCount = 0;
            modalMessage = '';
            gameMessage = welcomeMessage;

            isRunning = true;

            return maze;
        },
        updateGameMessage = () => {
            const { x: monsterX, y: monsterY } = monster.getPosition();
            if (
                monster.getHasBeenActivated() &&
                player.isAdjacent(monsterY, monsterX, 3)
            ) {
                gameMessage = monsterNearMessage;

                if (player.isAdjacent(monsterY, monsterX)) {
                    gameMessage = monsterAttackMessage;
                    return;
                }
            }

            items.forEach((item) => {
                const { name: itemName = '' } = item ?? {};
                if (!itemName.trim() || item.isCarried) return;

                if (player.isAdjacent(item.y, item.x)) {
                    gameMessage = `A${
                        startsWithVowel(itemName) ? 'n' : ''
                    } ${itemName.toLocaleLowerCase()} lays on the ground nearby!`;
                }
            });

            areas.forEach((area) => {
                const { symbol } = area || {};
                const { x, y } = player.getPosition();
                let itemDir = '';
                if (maze.valOf(y, x) === symbol) gameMessage = area.inMessage;
                else if (maze.valOf(y - 1, x) === symbol) itemDir = 'north';
                else if (maze.valOf(y + 1, x) === symbol) itemDir = 'south';
                else if (maze.valOf(y, x + 1) === symbol) itemDir = 'east';
                else if (maze.valOf(y, x - 1) === symbol) itemDir = 'west';

                if (itemDir)
                    gameMessage = `${area.nearMessageFragment} ${itemDir}.`;
            });
        },
        updateGameState = () => {
            updateGameMessage();
            turnCount++;
            if (checkForWin()) return;
            collectItems();
            checkForCollision();
            monster.move(pickMonsterDirection());
            checkForCollision();
        };

    const useItem = (id = '') => {
        if (!id) return false;

        const item = player
            .getInventory()
            .find(({ id: itemId }) => id === itemId);
        if (!item) return false;

        if (item?.type === ItemType.Key) {
            const { x: playerX, y: playerY } = player.getPosition();
            if (
                maze.valOf(playerY, playerX) === (item as KeyItem).areaToUse &&
                monster.activate(item.id)
            ) {
                gameMessage = item.useSuccessMessage;
                player.expendItem(id);
                items[items.findIndex((item) => item.id === id)].hasBeenUsed =
                    true;
                return true;
            }
        } else {
            gameMessage = item?.useFailMessage ?? '';
        }

        return false;
    };

    return {
        canPlayerMoveEast,
        canPlayerMoveNorth,
        canPlayerMoveSouth,
        canPlayerMoveWest,
        getCurrentMap: () => maze.getMap(),
        getGameMessage: () => gameMessage,
        getInventoryOptions: () =>
            renderInventoryOptions(player.getInventory()),
        getModalMessage: () => modalMessage,
        movePlayerEast,
        movePlayerNorth,
        movePlayerSouth,
        movePlayerWest,
        renderMazeRoguelike: () =>
            renderMazeRoguelike({ items, maze, monster, player }),
        startGame,
        useItem,
    };
};
