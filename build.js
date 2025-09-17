import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, build as viteBuild } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

const globalConfig = {
    libraryName: 'fluent-dom-esm',
    outDir: resolve(__dirname, 'dist'),
    basePath: resolve(__dirname),
    builds: [
        {
            base: '/',
            outDir: resolve(__dirname, 'dist'),
        },
        {
            base: '/maze-of-the-minotaur/',
            outDir: resolve(__dirname, 'dist-web', 'maze-of-the-minotaur'),
        },
        {
            base: '/webtoys/maze/',
            outDir: resolve(__dirname, 'dist-web', 'webtoys', 'maze'),
        },
    ],
    licenseBegin: '', // assigned in init()
    licenseEnd: '', // assigned in init()
    licensePath: resolve(__dirname, '.license-fragments'),
    /** @type Record<string, any>|null */
    pkg: null, // assigned in init()
    async init() {
        this.pkg = JSON.parse(
            await readFile(resolve(this.basePath, 'package.json'))
        );

        this.licenseBegin = await readFile(
            resolve(this.licensePath, 'license-begin.txt')
        );
        this.licenseEnd = await readFile(
            resolve(this.licensePath, 'license-end.txt')
        );

        this.builds = this.builds.map((config) => {
            config.format = 'es';
            return config;
        });
    },
};

const wrapWithLicense = async (config) => {
    const files = await readdir(resolve(config.outDir, 'assets'));
    const theFile = files.find((file) => file.endsWith('.js'));
    const fileText = await readFile(resolve(config.outDir, 'assets', theFile));

    await writeFile(
        resolve(config.outDir, 'assets', theFile),
        [globalConfig.licenseBegin, fileText, globalConfig.licenseEnd].join(''),
        { encoding: 'utf8', flag: 'w' }
    );
};

const buildWithVite = async (config) => {
    await viteBuild(
        defineConfig({
            base: config.base,
            build: {
                emptyOutDir: false,
                outDir: config.outDir,
                minify: true,
                sourcemap: true,
            },
            define: {
                'globalThis.__BUILD_VERSION__': JSON.stringify(
                    globalConfig.pkg.version
                ),
            },
            esbuild: {
                legalComments: 'inline',
            },
        })
    );
};

async function main() {
    await globalConfig.init();
    await Promise.all([
        ...globalConfig.builds.map((config) =>
            rm(config.outDir, { recursive: true, force: true })
        ),
    ]);
    await rm(globalConfig.outDir, { recursive: true, force: true });
    await Promise.all([
        ...globalConfig.builds.map((config) => buildWithVite(config)),
    ]);
    await Promise.all([
        ...globalConfig.builds.map((config) => wrapWithLicense(config)),
    ]);
    // eslint-disable-next-line no-undef
    console.log('Build complete.');
}

main();
