import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import banner from 'vite-plugin-banner';
import pkg from './package.json';

// https://vite.dev/config/
export default defineConfig(({command, mode, isSsrBuild, isPreview}) => {
    return {
        plugins: [
            svelte(),
            banner('/*!\n * EventCalendar v' + pkg.version + '\n * https://github.com/vkurko/calendar\n */')
        ],
        build: mode === 'iife'
            ? {
                lib: {
                    name: 'EventCalendar',
                    entry: ['packages/core/src/index.iife.js'],
                    fileName: () => 'event-calendar.min.js',
                    formats: ['iife'],
                    cssFileName: 'event-calendar.min',
                },
                outDir: 'packages/build/dist',
                sourcemap: true
            }
            : {
                lib: {
                    entry: ['packages/core/src/index.es.js'],
                    fileName: 'index',
                    formats: ['es'],
                    cssFileName: 'index',
                },
                minify: false,
                outDir: 'packages/core/dist',
                rollupOptions: {
                    external: ['svelte', 'svelte/reactivity', 'svelte/store']
                }
            }
    }
})
