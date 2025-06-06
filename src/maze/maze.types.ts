export enum Direction {
	North = 0,
	South = 1,
	East = 2,
	West = 3,
}

export enum ItemType {
	Key = "KEY",
	Weapon = "WEAPON",
}

export interface Position {
	row: number;
	col: number;
}

export interface Monster extends Position {
	hasBeenSummoned: boolean;
}

export interface Player extends Position {
	items: Item[];
	lastDirection?: Direction;
}

export interface Item extends Position {
	hasBeenUsed?: boolean;
	id: string;
	isCarried: boolean;
	name: string;
	type: ItemType;
	useFailText: string;
	useSuccessText: string;
}

export interface KeyItem extends Item {
	type: ItemType.Key;
	areaToUse: string;
}
