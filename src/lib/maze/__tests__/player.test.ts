import { describe, expect, it } from "vitest";
import Player from "../player"; // updateInventory, // move, // isAdjacent, // init, // getLocation, // getLastDirection, // getInventory,
import { getItems, getValueUnder } from "./helpers";

describe("player", () => {
	it("should initialize as expected", () => {
		const xStart = getValueUnder(10); // 0-9
		const yStart = getValueUnder(10); // 0-9
		const player = Player(yStart, xStart);

		expect(player.getPosition()).toEqual({ x: xStart, y: yStart });

		const xStart2 = getValueUnder(10); // 0-9
		const yStart2 = getValueUnder(10); // 0-9
		const player2 = Player(yStart2, xStart2);

		expect(player2.getPosition()).toEqual({
			x: xStart2,
			y: yStart2,
		});
		expect(player.getPosition()).toEqual({ x: xStart, y: yStart });

		expect(player.getLastDirection()).toBeUndefined();
	});

	it("should initialize with empty inventory", () => {
		const xStart = getValueUnder(10); // 0-9
		const yStart = getValueUnder(10); // 0-9
		const player = Player(xStart, yStart);

		expect(player.getInventory()).toEqual([]);
	});

	it("should update inventory when updateInventory is called", () => {
		const xStart = getValueUnder(10); // 0-9
		const yStart = getValueUnder(10); // 0-9
		const xStart2 = getValueUnder(10); // 0-9
		const yStart2 = getValueUnder(10); // 0-9
		const items = getItems(xStart, yStart);
		const player = Player(xStart, yStart);
		const player2 = Player(xStart2, yStart2);

		expect(player.getInventory()).toEqual([]);
		player.updateInventory(items);
		expect(player.getInventory()).toEqual(items);
		expect(player2.getInventory()).toEqual([]);
	});

	/*
    it("should use item in inventory", () => {
		const xStart = getValueUnder(10); // 0-9
		const yStart = getValueUnder(10); // 0-9
		const player = Player(xStart, yStart);
		expect(player.getInventory()).toEqual([]);

		const items = getItems(xStart, yStart);
		player.updateInventory(items);
		expect(player.getInventory()).toEqual(items);

		expect(player.useItem(items[0].id)).toEqual(items[0].useSuccessText);
	});
    */
});
