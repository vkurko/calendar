import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import banner from 'vite-plugin-banner';
import pkg from './package.json' with {type: 'json'};

// https://vite.dev/config/
export default defineConfig(({command, mode, isSsrBuild, isPreview}) => {
    return {
        // The adapters import the core by its package name, in development it is the source code
        resolve: command === 'serve'
            ? {alias: {'@event-calendar/core': import.meta.dirname + '/packages/core/src/index.es.js'}}
            : undefined,
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
                    external: [/^svelte(?:\/.+)?/]
                }
            }
    }
})
