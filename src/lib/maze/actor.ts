import { Direction, type ActorType } from './maze.types';

export default (yStart: number, xStart: number) => {
    let lastDirection: Direction,
        x = xStart,
        y = yStart;
    const moveEast = () => {
            x = x + 1;
            lastDirection = Direction.East;
        },
        moveNorth = () => {
            y = y - 1;
            lastDirection = Direction.North;
        },
        moveSouth = () => {
            y = y + 1;
            lastDirection = Direction.South;
        },
        moveWest = () => {
            x = x - 1;
            lastDirection = Direction.West;
        };

    return {
        getLastDirection: () => lastDirection,
        getPosition: () => ({ x: x, y: y }),
        getX: () => x,
        getY: () => y,
        isAdjacent: (yPos: number, xPos: number, range = 1) => {
            const distance = range + 1;
            return (
                Math.abs((x ?? distance) - xPos) < distance &&
                Math.abs((y ?? distance) - yPos) < distance
            );
        },
        moveEast,
        moveNorth,
        moveSouth,
        moveWest,
        move: (direction: Direction) => {
            if (direction === Direction.North) return moveNorth();
            if (direction === Direction.South) return moveSouth();
            if (direction === Direction.East) return moveEast();
            if (direction === Direction.West) return moveWest();
        },
    } as ActorType;
};
