import {
	Direction,
	ItemType,
	type Item,
	type Monster,
	type Player,
	type KeyItem,
} from "./maze.types";

const WALL = "@";
const PLAYER_START = "p";
const MONSTER_START = "m";
const PLAYER_MARKER = "P";
const MONSTER_MARKER = "M";
const SPACE = " ";
const HORN_MARKER = "H";
const PLAYER_EXIT = "X";

const DEFAULT_ITEMS: (Item | KeyItem)[] = [
	{
		id: "mouthpiece",
		name: "Horn Mouthpiece",
		isCarried: false,
		row: -1,
		col: -1,
		type: ItemType.Key,
		areaToUse: HORN_MARKER,
		useFailText: "You blow a raspberry into the mouthpiece.",
		useSuccessText:
			"The sound of the horn reverberates around the maze. The Minotaur is loosed!",
	},
	{
		id: "axe",
		name: "Magic Pickaxe",
		isCarried: false,
		row: -1,
		col: -1,
		type: ItemType.Weapon,
		useFailText: "You swing wildly in the air.",
		useSuccessText:
			"As the Minotaur lunges at you, you swing with the " +
			"pickaxe. It strikes him and explodes, stunning him.",
	},
	{
		id: "spear",
		name: "Magic Spear",
		isCarried: false,
		row: -1,
		col: -1,
		type: ItemType.Weapon,
		useFailText: "You stab wildly at the air.",
		useSuccessText:
			"As the Minotaur lunges at you, you stab with the " +
			"spear. It strikes him and explodes, stunning him.",
	},
];

let maze: string[][];
let mazeVisited: boolean[][];
let mazeSeen: boolean[][];

let isRunning = false;
let items: (Item | KeyItem)[];

let monster: Monster;
let player: Player;

let turnCount: number;

let gameMessage = "Welcome to Maze of the Minotaur!";
export const getGameMessage = () => gameMessage;

let modalMessage = "";
export const getModalMessage = () => modalMessage;

const isAdjacentToPlayer = (row: number, col: number, range = 1) => {
	const distance = range + 1;
	return (
		Math.abs((player?.row ?? distance) - row) < distance &&
		Math.abs((player?.col ?? distance) - col) < distance
	);
};

const init = (rows = 0, cols = 0) => {
	maze = Array.from({ length: rows }, () =>
		Array.from({ length: cols }, () => WALL)
	);
	mazeVisited = maze.map((row) =>
		row.map((val) => val === PLAYER_MARKER || val === PLAYER_START)
	);
	mazeSeen = maze.map((row) => row.map(() => false));
	items = Array.from(DEFAULT_ITEMS);
};

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
		if (row > 2 && maze[row - 2][col] === WALL) {
			updateVectorRow(row - 2, i);
			updateVectorCol(col, i);
			i++;
		}
		if (row < maze.length - 3 && maze[row + 2][col] === WALL) {
			updateVectorRow(row + 2, i);
			updateVectorCol(col, i);
			i++;
		}
		if (col > 2 && maze[row][col - 2] === WALL) {
			updateVectorRow(row, i);
			updateVectorCol(col - 2, i);
			i++;
		}
		if (col < maze[row].length - 3 && maze[row][col + 2] === WALL) {
			updateVectorRow(row, i);
			updateVectorCol(col + 2, i);
			i++;
		}

		if (i === 0) break; // dead end
		let r = Math.floor(Math.random() * i); // random direction
		while (r === 0 && noZero) {
			r = Math.floor(Math.random() * i); // bypass an error
		}
		maze[getVectorRow(r)][getVectorCol(r)] = SPACE;
		maze[(getVectorRow(r) + row) / 2][(getVectorCol(r) + col) / 2] = SPACE;
		digStep(getVectorRow(r), getVectorCol(r));
	}
};

const placeArea = (
	symbol = "",
	rowMin = 0,
	colMin = 0,
	rowMax = 0,
	colMax = 0
) => {
	if (!symbol || (rowMin === rowMax && colMin === colMax)) return;
	const row = Math.floor((rowMax - rowMin) / 2) + rowMin;
	const col = Math.floor((colMax - colMin) / 2) + colMin;

	if (
		maze[row][col] === WALL &&
		maze[row + 1][col] === SPACE &&
		maze[row][col - 1] === WALL &&
		maze[row][col + 1] === WALL
	) {
		maze[row][col] = symbol;
		return;
	}

	let newCol = col;
	do {
		let newRow = row - 1;
		while (newRow !== row) {
			if (
				maze[newRow][newCol] === WALL &&
				maze[newRow + 1][newCol] === SPACE &&
				maze[newRow][newCol - 1] === WALL &&
				maze[newRow][newCol + 1] === WALL
			) {
				maze[newRow][newCol] = symbol;
				return;
			}
			if (newRow === rowMin) newRow = Math.min(rowMax, maze.length - 2);
			else newRow = newRow - 1;
		}
		if (newCol === colMin) newCol = Math.min(colMax, maze[row].length - 2);
		else newCol = newCol - 1;
	} while (newCol !== col);
};

export const getEmptyCellArray = () =>
	maze.reduce(
		(acc: { row: number; col: number }[], row, rownum) =>
			acc.concat(
				row
					.map((val, colnum) =>
						val === SPACE ? { row: rownum, col: colnum } : null
					)
					.filter((val) => val !== null) as {
					row: number;
					col: number;
				}[]
			),
		[]
	);

const clearSpaceValues = [SPACE, PLAYER_MARKER, HORN_MARKER];

const isClearNorth = (row: number, col: number) =>
	row > 0 &&
	(clearSpaceValues.includes(maze[row - 1][col]) ||
		(monster.hasBeenSummoned && maze[row - 1][col] === MONSTER_START));
const isClearSouth = (row: number, col: number) =>
	row < maze.length - 1 && clearSpaceValues.includes(maze[row + 1][col]);
const isClearEast = (row: number, col: number) =>
	col < maze[row].length - 1 && clearSpaceValues.includes(maze[row][col + 1]);
const isClearWest = (row: number, col: number) =>
	col > 0 && clearSpaceValues.includes(maze[row][col - 1]);

const pickMonsterDirection = () => {
	const { row, col } = monster ?? {};
	const aggressionFactor = Math.random() * 2;

	// if player is within 2 spaces and the path is clear between them,
	// move that direction
	if (isAdjacentToPlayer(row, col, 2) || aggressionFactor > 1) {
		if (row < player.row && maze[row + 1][col] === SPACE)
			return Direction.South;
		if (row > player.row && maze[row - 1][col] === SPACE)
			return Direction.North;
		if (col < player.col && maze[row][col + 1] === SPACE)
			return Direction.East;
		else if (col > player.col && maze[row][col - 1] === SPACE)
			return Direction.West;
	}

	// determine random direction based on available spaces
	const directionOptions: (Direction | null)[] = [null];
	if (isClearNorth(row, col)) directionOptions.push(Direction.North);
	if (isClearSouth(row, col)) directionOptions.push(Direction.South);
	if (isClearEast(row, col)) directionOptions.push(Direction.East);
	if (isClearWest(row, col)) directionOptions.push(Direction.West);

	return directionOptions[
		Math.floor(Math.random() * directionOptions.length)
	];
};
const moveMonster = (direction: Direction | null) => {
	if (direction === null || !monster.hasBeenSummoned) return;

	const { row, col } = monster ?? {};
	if (typeof row === "undefined" || typeof col === "undefined") return;

	let newRow = row,
		newCol = col;

	if (direction === Direction.North && isClearNorth(row, col))
		newRow = row - 1;
	if (direction === Direction.South && isClearSouth(row, col))
		newRow = row + 1;
	if (direction === Direction.East && isClearEast(row, col)) newCol = col + 1;
	if (direction === Direction.West && isClearWest(row, col)) newCol = col - 1;

	if (newRow === row && newCol === col) return;

	monster.row = newRow;
	monster.col = newCol;

	const isAdjacent = isAdjacentToPlayer(newRow, newCol);
	const isNear = isAdjacentToPlayer(newRow, newCol, 3);
	if (isAdjacent) gameMessage = "The Minotaur lunges after you.";
	else if (isNear)
		gameMessage = "You hear the Minotaur's heavy steps and breathing.";
};

const movePlayer = (direction: Direction) => {
	if (typeof direction === "undefined") return;

	const { row, col } = player ?? {};
	if (typeof row === "undefined" || typeof col === "undefined") return;

	let newRow = row,
		newCol = col;

	if (direction === Direction.North && isClearNorth(row, col))
		newRow = row - 1;
	if (direction === Direction.South && isClearSouth(row, col))
		newRow = row + 1;
	if (direction === Direction.East && isClearEast(row, col)) newCol = col + 1;
	if (direction === Direction.West && isClearWest(row, col)) newCol = col - 1;

	if (newRow === row && newCol === col) return;

	player.row = newRow;
	player.col = newCol;
	player.lastDirection = direction;
};

const markVisited = () => {
	const { row, col } = player ?? {};
	mazeVisited[row][col] = true;
	if (row > 0) {
		if (col > 0) {
			mazeSeen[row - 1][col - 1] = true;
			mazeSeen[row - 1][col] = true;
			mazeSeen[row][col - 1] = true;
			mazeSeen[row][col] = true;
			if (row < mazeVisited.length - 1) {
				mazeSeen[row + 1][col - 1] = true;
				mazeSeen[row + 1][col] = true;
			}
			if (col < mazeVisited[row].length - 1) {
				mazeSeen[row - 1][col + 1] = true;
				mazeSeen[row][col + 1] = true;
				if (row < mazeVisited.length - 1) {
					mazeSeen[row + 1][col + 1] = true;
				}
			}
		}
	}
};

const collectItems = () => {
	// items
	items = structuredClone(items).map((item) => {
		if (
			!item.isCarried &&
			item.row === player.row &&
			item.col === player.col
		) {
			gameMessage = `You picked up a ${item.name}!`;

			return {
				...item,
				isCarried: true,
			};
		}
		return item;
	});

	player.items = structuredClone(items)
		.filter(
			({ hasBeenUsed = false, isCarried }) => isCarried && !hasBeenUsed
		)
		.map(({ row, col, ...props }) => ({
			...props,
			row: player.row,
			col: player.col,
		}));
};

const checkForCollision = () => {
	// if no player / monster collision, done
	if (!(player.row === monster.row && player.col === monster.col)) return;

	const weapons = player.items.filter(({ type }) => type === ItemType.Weapon);

	// check for weapons
	if (weapons.length) {
		const theWeapon = weapons[0];

		gameMessage = theWeapon.useSuccessText;
		player.items = player.items.filter(({ id }) => id !== theWeapon.id);
		const weaponIndex = items.findIndex(({ id }) => id === theWeapon.id);
		items[weaponIndex].hasBeenUsed = true;

		const { row, col, lastDirection } = player ?? {};

		// move away from the minotaur
		for (let i = 0; i < 3; i++) {
			let directionOptions: Direction[] = [];
			if (i === 0) {
				if (lastDirection !== Direction.North && isClearNorth(row, col))
					directionOptions.push(Direction.North);
				if (lastDirection !== Direction.South && isClearSouth(row, col))
					directionOptions.push(Direction.South);
				if (lastDirection !== Direction.East && isClearEast(row, col))
					directionOptions.push(Direction.East);
				if (lastDirection !== Direction.West && isClearWest(row, col))
					directionOptions.push(Direction.West);
			} else {
				// prefer to keep running in that direction
				if (lastDirection === Direction.North && isClearNorth(row, col))
					directionOptions.push(Direction.North);
				if (lastDirection === Direction.South && isClearSouth(row, col))
					directionOptions.push(Direction.South);
				if (lastDirection === Direction.East && isClearEast(row, col))
					directionOptions.push(Direction.East);
				if (lastDirection === Direction.West && isClearWest(row, col))
					directionOptions.push(Direction.West);

				// don't go backwards
				if (lastDirection !== Direction.South && isClearNorth(row, col))
					directionOptions.push(Direction.North);
				if (lastDirection !== Direction.North && isClearSouth(row, col))
					directionOptions.push(Direction.South);
				if (lastDirection !== Direction.West && isClearEast(row, col))
					directionOptions.push(Direction.East);
				if (lastDirection !== Direction.East && isClearWest(row, col))
					directionOptions.push(Direction.West);
			}

			if (directionOptions.length) {
				movePlayer(
					directionOptions[
						Math.floor(Math.random() * directionOptions.length)
					]
				);
			}
		}
	} else {
		isRunning = false;
		gameMessage = "The Minotaur gored you. YOU HAVE DIED!";
		modalMessage = "You Have Died!";
	}
};

const checkForWin = () => {
	const { row, col } = player ?? {};
	if (maze[row][col] === MONSTER_START && monster.hasBeenSummoned) {
		isRunning = false;
		gameMessage = `You escaped the Minotaur in ${turnCount} turns. YOU HAVE WON!`;
		modalMessage = "You Have Won!";
	}
	return !isRunning;
};

const updateGameState = () => {
	turnCount++;
	if (checkForWin()) return;
	// checkForCollision();
	markVisited();
	collectItems();
	moveMonster(pickMonsterDirection());
	checkForCollision();
};

const movePlayerAndUpdate = (direction: Direction) => {
	if (!isRunning) return;

	movePlayer(direction);
	updateGameState();
};

export const movePlayerNorth = () => movePlayerAndUpdate(Direction.North);
export const movePlayerSouth = () => movePlayerAndUpdate(Direction.South);
export const movePlayerEast = () => movePlayerAndUpdate(Direction.East);
export const movePlayerWest = () => movePlayerAndUpdate(Direction.West);

const placeItems = () => {
	let emptyCells = getEmptyCellArray();
	items = Array.from(DEFAULT_ITEMS).map((item) => {
		const randomIndex = Math.floor(Math.random() * emptyCells.length);
		const { row, col } = emptyCells[randomIndex];
		emptyCells = emptyCells.filter((_, idx) => idx !== randomIndex);
		return {
			...item,
			col,
			row,
		};
	});
};

export const createMaze = (gapRows = 0, gapCols = 0) => {
	init(gapRows * 2 + 1, gapCols * 2 + 1);

	const monsterCol = Math.floor(Math.random() * (gapCols * 2 - 4)) + 2;
	let playerCol = Math.floor(Math.random() * (gapCols * 2 - 1) + 1);

	maze[0][monsterCol] = MONSTER_START;
	monster = { hasBeenSummoned: false, row: 0, col: monsterCol };

	maze[gapRows * 2][playerCol] = PLAYER_START;
	player = { items: [], row: gapRows * 2, col: playerCol };

	digStep(1, monsterCol, true);
	placeArea(
		HORN_MARKER,
		gapRows < 4 ? 0 : gapRows - 4,
		gapCols < 4 ? 0 : gapCols - 4,
		gapRows + 5,
		gapCols + 5
	);

	placeItems();

	if (maze[gapRows * 2 - 1][playerCol] !== SPACE) {
		maze[gapRows * 2][playerCol] = WALL;
		while (maze[gapRows * 2 - 1][playerCol] !== SPACE) {
			if (playerCol < 2) playerCol = maze[0].length - 3;
			else playerCol = playerCol - 1;
		}
		maze[gapRows * 2][playerCol] = PLAYER_START;
		player = { items: [], row: gapRows * 2, col: playerCol };
	}

	turnCount = 0;
	modalMessage = "";
	gameMessage = "Welcome to Maze of the Minotaur!";

	isRunning = true;

	return maze;
};

const getSpan = (val: string, color: string) =>
	`<span style="color: ${color}">${val}</span>`;

export const renderMazeRL = () =>
	maze
		.map((row, rownum) =>
			row.map((originalVal, colnum) => {
				let val = originalVal;

				const isAdjacent = isAdjacentToPlayer(rownum, colnum);

				// items
				items.forEach((item) => {
					if (
						!item.isCarried &&
						item.row === rownum &&
						item.col === colnum
					) {
						if (item.id === "spear") val = "&#x2197;"; // ↗
						else if (item.id === "axe") val = "&#9935;"; // ⛏
						else if (item.id === "mouthpiece") val = "v";
						else val = "/";

						if (isAdjacentToPlayer(rownum, colnum))
							gameMessage = `A ${item.name.toLocaleLowerCase()} lays on the ground nearby!`;
					}
				});

				if (originalVal === HORN_MARKER && !monster.hasBeenSummoned) {
					let hornDir;
					if (rownum === player.row && colnum === player.col) {
						gameMessage =
							"You're in an empty room with a large horn. It appears to be missing its mouthpiece.";
					} else if (isAdjacent) {
						if (rownum < player.row) hornDir = "north";
						else if (rownum > player.row) hornDir = "south";
						else if (colnum < player.col) hornDir = "west";
						else hornDir = "east";

						gameMessage = `A large horn sits in a room to the ${hornDir}.`;
					}
				}

				// player
				if (rownum === player.row && colnum === player.col) {
					return getSpan(PLAYER_MARKER, "yellow");
				}

				if (val === MONSTER_START) {
					if (monster.hasBeenSummoned) val = PLAYER_EXIT;
					val = WALL;
				}
				if (val === PLAYER_START) val = WALL;

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
						rownum > 0 &&
						(maze[rownum - 1][colnum] === WALL ||
							(maze[rownum - 1][colnum] === MONSTER_START &&
								!monster.hasBeenSummoned))
					)
						hasWallNorth = true;
					if (
						rownum < maze.length - 1 &&
						(maze[rownum + 1][colnum] === WALL ||
							(maze[rownum + 1][colnum] === MONSTER_START &&
								!monster.hasBeenSummoned))
					)
						hasWallSouth = true;
					if (
						colnum > 0 &&
						(maze[rownum][colnum - 1] === WALL ||
							(maze[rownum][colnum - 1] === MONSTER_START &&
								!monster.hasBeenSummoned))
					)
						hasWallWest = true;
					if (
						(colnum < maze[rownum].length - 1 &&
							maze[rownum][colnum + 1] === WALL) ||
						(maze[rownum][colnum + 1] === MONSTER_START &&
							!monster.hasBeenSummoned)
					)
						hasWallEast = true;

					if (hasWallNorth) {
						if (hasWallSouth) {
							if (hasWallEast) {
								if (hasWallWest) {
									val = "&#x256C;"; // ╬
								} else {
									val = "&#x2560;"; // ╠
								}
							} else {
								if (hasWallWest) {
									val = "&#x2563;"; // ╣
								} else {
									val = "&#x2551;"; // ║
								}
							}
						} else {
							if (hasWallEast) {
								if (hasWallWest) {
									val = "&#x2569;"; // ╩
								} else {
									val = "&#x255A;"; // ╚
								}
							} else {
								if (hasWallWest) {
									val = "&#x255D;"; // ╝
								} else {
									val = "&#x2568;"; // ╨
								}
							}
						}
					} else {
						if (hasWallSouth) {
							if (hasWallEast) {
								if (hasWallWest) {
									val = "&#x2566;"; // ╦
								} else {
									val = "&#x2554;"; // ╔
								}
							} else {
								if (hasWallWest) {
									val = "&#x2557;"; // ╗
								} else {
									val = "&#x2565;"; // ╥
								}
							}
						} else {
							if (hasWallEast) {
								if (hasWallWest) {
									val = "&#x2550;"; // ═
								} else {
									val = "&#x255E;"; // ╞
								}
							} else {
								if (hasWallWest) {
									val = "&#x2561;"; // ╡
								} else {
									val = "&#x25A1;"; // □
								}
							}
						}
					}
				}

				// adjacent to player
				if (isAdjacent) {
					if (
						monster.row === rownum &&
						monster.col === colnum &&
						monster.hasBeenSummoned
					)
						return getSpan(MONSTER_MARKER, "red");
					return getSpan(val, "white");
				}

				// visited
				if (mazeSeen[rownum][colnum]) return getSpan(val, "grey");

				return getSpan("&#x2591;", "grey");
			})
		)
		.map((arr) => arr.join(""))
		.join("\n");

export const getInventoryOptions = () => {
	if ((player?.items ?? []).length === 0)
		return `<option value=""><em>Empty</em></option>`;

	return player.items
		.map(({ id, name }) => `<option value="${id}">${name}</option>`)
		.join("\n");
};

export const useItem = (id = "") => {
	if (!id) return false;

	const item = player.items.find(({ id: itemId }) => id === itemId);
	if (!item) return false;

	if (item?.type === ItemType.Key) {
		if (maze[player.row][player.col] === (item as KeyItem).areaToUse) {
			gameMessage = item.useSuccessText;

			// not sure where else to put game specific logic
			if ((item as KeyItem).areaToUse === HORN_MARKER) {
				monster.hasBeenSummoned = true;
				player.items = player.items.filter(
					({ id }) => id !== "mouthpiece"
				);
				items[
					items.findIndex(({ id }) => id === "mouthpiece")
				].hasBeenUsed = true;
			}
			return true;
		}
	} else {
		gameMessage = item?.useFailText ?? "";
	}

	return false;
};
