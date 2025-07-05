import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
	if (command === "deploy") {
		return {
			build: "/maze-of-the-minotaur/",
		};
	}
	return {}
});
