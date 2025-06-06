import "./style.css";
import {
	createMaze,
	renderMazeRL,
	movePlayerNorth,
	movePlayerSouth,
	movePlayerEast,
	movePlayerWest,
	getGameMessage,
	getInventoryOptions,
	useItem,
	getModalMessage,
} from "./maze";

const body = document.body;
const mazeOutput = document.getElementById("mazeOutput");
const textOutput = document.getElementById("app-text-output");
const inventoryOutput = document.getElementById("inventoryOutput");
const inventoryUseButton = document.getElementById("inventory-useButton");
const modalElement = document.getElementById("app-modal");
const modalResult = document.getElementById("app-modal-result");

const startGame = () => {
	createMaze(5, 16);
	modalElement?.classList.remove("show");
	if (mazeOutput) mazeOutput.innerHTML = renderMazeRL();
	if (textOutput) textOutput.innerText = getGameMessage();
	if (inventoryOutput) inventoryOutput.innerHTML = getInventoryOptions();
};

startGame();

const updateGameInterface = () => {
	if (mazeOutput) mazeOutput.innerHTML = renderMazeRL();
	if (textOutput) textOutput.innerText = getGameMessage();
	if (inventoryOutput) inventoryOutput.innerHTML = getInventoryOptions();
	const modalMessage = getModalMessage();
	if (modalElement && modalResult && modalMessage) {
		modalResult.innerText = modalMessage;
		modalElement.classList.add("show");
	}
};

if (inventoryUseButton) {
	inventoryUseButton?.addEventListener("click", () => {
		if (!inventoryOutput) return;

		if (useItem((inventoryOutput as HTMLSelectElement)?.value ?? "")) {
			updateGameInterface();
		} else {
			if (textOutput) textOutput.innerText = getGameMessage();
		}
	});
}

body.addEventListener("keydown", (event: KeyboardEvent) => {
	if (event.key === "ArrowUp" || event.key.toLocaleUpperCase() === "N")
		movePlayerNorth();
	else if (event.key === "ArrowDown" || event.key.toLocaleUpperCase() === "S")
		movePlayerSouth();
	else if (event.key === "ArrowLeft" || event.key.toLocaleUpperCase() === "W")
		movePlayerWest();
	else if (
		event.key === "ArrowRight" ||
		event.key.toLocaleUpperCase() === "E"
	)
		movePlayerEast();
	else if (event.key.toLocaleUpperCase() === "H") useItem("mouthpiece");

	updateGameInterface();
});

document.getElementById("goNorthButton")?.addEventListener("click", () => {
	movePlayerNorth();
	updateGameInterface();
});

document.getElementById("goSouthButton")?.addEventListener("click", () => {
	movePlayerSouth();
	updateGameInterface();
});

document.getElementById("goWestButton")?.addEventListener("click", () => {
	movePlayerWest();
	updateGameInterface();
});

document.getElementById("goEastButton")?.addEventListener("click", () => {
	movePlayerEast();
	updateGameInterface();
});

document.getElementById("app-modal-button")?.addEventListener("click", () => {
	startGame();
});
