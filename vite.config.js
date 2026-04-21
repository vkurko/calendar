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
                    fileName: format => {
                        if (format === 'iife') return 'event-calendar.min.js';
                        if (format === 'es') return 'event-calendar.min.mjs';
                        if (format === 'cjs') return 'event-calendar.min.cjs';
                        return `event-calendar.min.${format}.js`;
                    },
                    formats: ['iife', 'es', 'cjs'],
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
