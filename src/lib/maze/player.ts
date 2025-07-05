import { type Item, type PlayerType } from './maze.types';
import Actor from './actor';

export default (yStart: number, xStart: number) => {
    let inventory: Item[] = [];
    const actor = Actor(yStart, xStart),
        updateInventory = (newItems: Item[]) => (inventory = newItems);

    return {
        ...actor,
        getInventory: () => inventory,
        updateInventory,
        expendItem: (id: string) =>
            updateInventory(inventory.filter((item) => item.id !== id)),
    } as PlayerType;
};
