import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
	base: command === 'deploy' ? "/maze-of-the-minotaur/" : './',
}));
