export enum Direction {
    North = 0,
    South = 1,
    East = 2,
    West = 3,
}

export enum ItemType {
    Key = 'KEY',
    Weapon = 'WEAPON',
}

export interface ActorType {
    getLastDirection: () => Direction;
    getPosition: () => { x: number; y: number };
    getX: () => number;
    getY: () => number;
    isAdjacent: (yPos: number, xPos: number, range?: number) => boolean;
    move: (direction: Direction | null) => void;
    moveEast: () => void;
    moveNorth: () => void;
    moveSouth: () => void;
    moveWest: () => void;
}

export interface GameConfig {
    areas: PlaceAreaConfig[];
    gapCols: number;
    gapRows: number;
    items: GameItem[];
    messages?: GameConfigMessages;
    monsterActivationKeyID: string;
}

export interface GameConfigMessages {
    loseModal?: string;
    loseStatus?: string;
    monsterAttack: string;
    monsterNear: string;
    welcome?: string;
    winModal?: string;
    winStatusFragment?: string;
}

export type GameItem = Item | KeyItem;

export interface GameType {
    canPlayerMoveEast: () => boolean;
    canPlayerMoveNorth: () => boolean;
    canPlayerMoveSouth: () => boolean;
    canPlayerMoveWest: () => boolean;
    getCurrentMap: () => string[][];
    getGameMessage: () => string;
    getInventoryOptions: () => string;
    getModalMessage: () => string;
    movePlayerEast: () => void;
    movePlayerNorth: () => void;
    movePlayerSouth: () => void;
    movePlayerWest: () => void;
    renderMazeRoguelike: () => string;
    startGame: () => void;
    useItem: () => void;
}

export interface Item extends Position {
    hasBeenUsed?: boolean;
    id: string;
    isCarried: boolean;
    name: string;
    type: ItemType;
    useFailMessage: string;
    useSuccessMessage: string;
}

export interface KeyItem extends Item {
    type: ItemType.Key;
    areaToUse: string;
}

export interface MazeType {
    digStep: (row: number, col: number, noZero: boolean) => void;
    getEmptyCellArray: () => Position[];

    getMap: () => string[][];
    getMapSeen: () => boolean[][];
    getMapVisited: () => boolean[][];

    isClearNorth: (y: number, x: number) => boolean;
    isClearSouth: (y: number, x: number) => boolean;
    isClearEast: (y: number, x: number) => boolean;
    isClearWest: (y: number, x: number) => boolean;

    markVisited: (y: number, x: number) => void;
    placeArea: (config: PlaceAreaConfig) => void;
    setCellValue: (y: number, x: number, value: string) => void;
    toString: () => string;
    valOf: (y: number, x: number) => string | undefined;
}

export interface MonsterConfig {
    activationKeyID: string;
    startX: number;
    startY: number;
}

export interface MonsterType extends ActorType {
    activate: (activationKeyID: string) => void;
    getHasBeenActivated: () => boolean;
}

export interface PlaceAreaConfig {
    inMessage: string;
    nearMessageFragment: string;
    symbol?: string;
    xMax?: number;
    xMin?: number;
    yMax?: number;
    yMin?: number;
}

export interface PlayerType extends ActorType {
    getInventory: () => Item[];
    updateInventory: (newItems: Item[]) => void;
    expendItem: (id: string) => void;
}

export interface Position {
    x: number;
    y: number;
}
