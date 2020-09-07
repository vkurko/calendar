import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'packages/common/src/index.js',
		output: {
			format: 'es',
			file: 'packages/common/index.js'
		},
		external: ['svelte/internal', 'svelte/store'],
		plugins: [
			svelte({
				dev: !production,
				css: false
			})
		],
	},
	{
		input: 'packages/day-grid/src/index.js',
		output: {
			format: 'es',
			file: 'packages/day-grid/index.js'
		},
		external: ['@event-calendar/common', 'svelte', 'svelte/internal', 'svelte/store'],
		plugins: [
			svelte({
				dev: !production,
				css: false
			})
		],
	},
	{
		input: 'packages/list/src/index.js',
		output: {
			format: 'es',
			file: 'packages/list/index.js'
		},
		external: ['@event-calendar/common', 'svelte', 'svelte/internal', 'svelte/store'],
		plugins: [
			svelte({
				dev: !production,
				css: false
			})
		],
	},
	{
		input: 'packages/time-grid/src/index.js',
		output: {
			format: 'es',
			file: 'packages/time-grid/index.js'
		},
		external: ['@event-calendar/common', 'svelte', 'svelte/internal', 'svelte/store'],
		plugins: [
			svelte({
				dev: !production,
				css: false
			})
		],
	},
	{
		input: 'packages/resource-time-grid/src/index.js',
		output: {
			format: 'es',
			file: 'packages/resource-time-grid/index.js'
		},
		external: ['@event-calendar/time-grid', 'svelte', 'svelte/internal', 'svelte/store'],
		plugins: [
			svelte({
				dev: !production,
				css: false
			})
		],
	},
	{
		input: 'packages/core/src/index.js',
		output: {
			format: 'es',
			// set 'dir' and 'entryFileNames' instead of 'file' for css.write()
			// to be able to emit css file to the 'build' directory
			dir: 'packages',
			entryFileNames: 'core/[name].js'
		},
		external: ['@event-calendar/common', 'svelte', 'svelte/internal', 'svelte/store'],
		plugins: [
			svelte({
				// enable run-time checks when not in production
				dev: !production,
				// we'll extract any component CSS out into
				// a separate file - better for performance
				css: css => {
					css.write('core/index.css', false);
					css.write('build/event-calendar.min.css');
				}
			})
		],
	},
	{
		input: 'packages/build/src/index.js',
		output: {
			format: 'iife',
			name: 'EventCalendar',
			file: 'packages/build/event-calendar.min.js',
			sourcemap: true
		},
		plugins: [
			svelte({
				// enable run-time checks when not in production
				dev: !production
			}),
			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),

			babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				babelHelpers: 'runtime',
				// babelHelpers: 'bundled',
				exclude: ['node_modules/@babel/**', 'node_modules/core-js-pure/**'],
				presets: [
					['@babel/preset-env', {
						targets: production ? '> 0.25%, not dead' : 'supports es6-module',
						// modules: false,
						// spec: true,
						// forceAllTransforms: true,
						// useBuiltIns: 'usage',
						shippedProposals: true,
						// corejs: '3.6.5'
					}]
				],
				plugins: [
					['@babel/plugin-transform-runtime', {
						useESModules: true,
						corejs: 3
					}]
				]
			}),

			// In dev mode, call `npm run start` once
			// the bundle has been generated
			!production && serve(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			!production && livereload('public'),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser()
		],
		watch: {
			clearScreen: false
		}
	}
];

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
