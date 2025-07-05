import './style.css';
import Minotaur from './lib/maze-minotaur';

const {
    canPlayerMoveEast,
    canPlayerMoveNorth,
    canPlayerMoveSouth,
    canPlayerMoveWest,
    getGameMessage,
    getInventoryOptions,
    getModalMessage,
    movePlayerNorth,
    movePlayerSouth,
    movePlayerEast,
    movePlayerWest,
    renderMazeRoguelike,
    startGame: startMazeGame,
    useItem,
} = Minotaur();

const body = document.body,
    mazeOutput = document.getElementById('mazeOutput'),
    textOutput = document.getElementById('app-text-output'),
    inventoryOutput = document.getElementById('inventoryOutput'),
    inventoryUseButton = document.getElementById('inventory-useButton'),
    modalElement = document.getElementById('app-modal'),
    modalResult = document.getElementById('app-modal-result'),
    goNorthButton = document.getElementById('goNorthButton'),
    goSouthButton = document.getElementById('goSouthButton'),
    goEastButton = document.getElementById('goEastButton'),
    goWestButton = document.getElementById('goWestButton');

const updateGameInterface = () => {
    if (mazeOutput) mazeOutput.innerHTML = renderMazeRoguelike();
    if (textOutput) textOutput.innerText = getGameMessage();
    if (inventoryOutput) inventoryOutput.innerHTML = getInventoryOptions();

    if (canPlayerMoveNorth()) goNorthButton?.removeAttribute('disabled');
    else goNorthButton?.setAttribute('disabled', 'disabled');

    if (canPlayerMoveSouth()) goSouthButton?.removeAttribute('disabled');
    else goSouthButton?.setAttribute('disabled', 'disabled');

    if (canPlayerMoveEast()) goEastButton?.removeAttribute('disabled');
    else goEastButton?.setAttribute('disabled', 'disabled');

    if (canPlayerMoveWest()) goWestButton?.removeAttribute('disabled');
    else goWestButton?.setAttribute('disabled', 'disabled');

    const modalMessage = getModalMessage();
    if (modalElement && modalResult && modalMessage) {
        modalResult.innerText = modalMessage;
        modalElement.classList.add('show');
    }
};

if (inventoryUseButton) {
    inventoryUseButton?.addEventListener('click', () => {
        if (!inventoryOutput) return;

        if (useItem((inventoryOutput as HTMLSelectElement)?.value ?? '')) {
            updateGameInterface();
        } else {
            if (textOutput) textOutput.innerText = getGameMessage();
        }
    });
}

body.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' || event.key.toLocaleUpperCase() === 'N')
        movePlayerNorth();
    else if (event.key === 'ArrowDown' || event.key.toLocaleUpperCase() === 'S')
        movePlayerSouth();
    else if (event.key === 'ArrowLeft' || event.key.toLocaleUpperCase() === 'W')
        movePlayerWest();
    else if (
        event.key === 'ArrowRight' ||
        event.key.toLocaleUpperCase() === 'E'
    )
        movePlayerEast();
    else if (event.key.toLocaleUpperCase() === 'H') useItem('mouthpiece');

    updateGameInterface();
});

document.getElementById('goNorthButton')?.addEventListener('click', () => {
    movePlayerNorth();
    updateGameInterface();
});

document.getElementById('goSouthButton')?.addEventListener('click', () => {
    movePlayerSouth();
    updateGameInterface();
});

document.getElementById('goWestButton')?.addEventListener('click', () => {
    movePlayerWest();
    updateGameInterface();
});

document.getElementById('goEastButton')?.addEventListener('click', () => {
    movePlayerEast();
    updateGameInterface();
});

document.getElementById('app-modal-button')?.addEventListener('click', () => {
    startGame();
});

const startGame = () => {
    startMazeGame();
    modalElement?.classList.remove('show');
    updateGameInterface();

    if (mazeOutput) mazeOutput.innerHTML = renderMazeRoguelike();
    if (textOutput) textOutput.innerText = getGameMessage();
    if (inventoryOutput) inventoryOutput.innerHTML = getInventoryOptions();
};

startGame();
