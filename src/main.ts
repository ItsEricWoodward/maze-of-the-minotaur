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
    goWestButton = document.getElementById('goWestButton'),
    titleScreen = document.getElementById('app-title-screen'),
    instructionsScreen = document.getElementById('app-instructions-modal'),
    instructionsButtons = document.querySelectorAll('.instructions-button'),
    startMazeButtons = document.querySelectorAll('.start-maze-button');

const showInstructionsScreen = () => {
    instructionsScreen?.classList?.add?.('show');
    titleScreen?.classList.add('hide');
};

const enterMaze = () => {
    instructionsScreen?.classList?.remove?.('show');
    titleScreen?.classList.add('hide');
};

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
    const { key } = event ?? {};
    const keyUpper = (key ?? '').toLocaleUpperCase();
    if (key === 'ArrowUp' || keyUpper === 'N') movePlayerNorth();
    else if (key === 'ArrowDown' || keyUpper === 'S') movePlayerSouth();
    else if (key === 'ArrowLeft' || keyUpper === 'W') movePlayerWest();
    else if (key === 'ArrowRight' || keyUpper === 'E') movePlayerEast();
    else if (keyUpper === 'H') useItem('mouthpiece');
    else if (keyUpper === 'I') showInstructionsScreen();
    else if (key === 'Escape' || keyUpper === 'M') {
        enterMaze();
    }

    updateGameInterface();
});

goNorthButton?.addEventListener('click', () => {
    movePlayerNorth();
    updateGameInterface();
});

goSouthButton?.addEventListener('click', () => {
    movePlayerSouth();
    updateGameInterface();
});

goWestButton?.addEventListener('click', () => {
    movePlayerWest();
    updateGameInterface();
});

goEastButton?.addEventListener('click', () => {
    movePlayerEast();
    updateGameInterface();
});

document.getElementById('app-modal-button')?.addEventListener('click', () => {
    startGame();
});

instructionsButtons.forEach((element) => {
    element.addEventListener('click', showInstructionsScreen);
});

startMazeButtons.forEach((element) => {
    element.addEventListener('click', enterMaze);
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
