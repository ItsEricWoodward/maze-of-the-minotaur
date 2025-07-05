import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
	if (command === "deploy") {
		return {
			base: "/maze-of-the-minotaur/",
		};
	}
	return {}
});
