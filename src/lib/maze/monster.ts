import Actor from './actor';
import type { Direction, MonsterConfig } from './maze.types';

export default ({ activationKeyID, startX, startY }: MonsterConfig) => {
    let hasBeenActivated = false;
    const actor = Actor(startY, startX),
        move = (direction: Direction | null) =>
            hasBeenActivated && actor.move(direction),
        moveEast = () => hasBeenActivated && actor.moveEast(),
        moveNorth = () => hasBeenActivated && actor.moveNorth(),
        moveSouth = () => hasBeenActivated && actor.moveSouth(),
        moveWest = () => hasBeenActivated && actor.moveWest();

    return {
        ...actor,
        activate: (keyID: string) => {
            if (hasBeenActivated) return false;
            hasBeenActivated = keyID === activationKeyID;
            return hasBeenActivated;
        },
        getActivationKeyID: () => activationKeyID,
        getHasBeenActivated: () => hasBeenActivated,
        move,
        moveEast,
        moveNorth,
        moveSouth,
        moveWest,
    };
};
