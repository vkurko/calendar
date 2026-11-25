// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import optionGroups from './src/options-sidebar.mjs';
import exampleGroups from './src/examples-sidebar.mjs';
import methods from './src/methods-sidebar.mjs';

// https://astro.build/config
export default defineConfig({
    // GitHub Pages project site
    site: 'https://vkurko.github.io',
    base: '/calendar',
    integrations: [starlight({
        title: 'EventCalendar',
        customCss: ['./src/styles/site.css'],
        social: [
            { icon: 'github', label: 'GitHub', href: 'https://github.com/vkurko/calendar' },
        ],
        sidebar: [
            { label: 'Getting started', slug: 'usage' },
            {
                label: 'Examples',
                items: ['examples', ...exampleGroups],
            },
            {
                label: 'Options',
                collapsed: true,
                items: ['options', ...optionGroups],
            },
            { label: 'Methods', collapsed: true, items: ['methods', ...methods] },
            {
                label: 'Objects',
                items: [
                    { label: 'Content', slug: 'content' },
                    { label: 'Event', slug: 'event-object' },
                    { label: 'Duration', slug: 'duration-object' },
                    { label: 'Resource', slug: 'resource-object' },
                    { label: 'View', slug: 'view-object' },
                ],
            },
            { label: 'Theming', slug: 'theming' },
            { label: 'Browser support', slug: 'browser-support' },
            { label: 'Changelog', slug: 'changelog' },
        ],
    }), svelte()],
});
