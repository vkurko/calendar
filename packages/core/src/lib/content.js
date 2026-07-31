import {isFunction} from './utils.js';

/**
 * Resolve the content of an option, which can be given as a value, as a function or as a Svelte snippet.
 * `arg` and `fallback` are functions, so that they are evaluated only when they are actually needed.
 * Returns `{content}` for the value/function form and `{snippet, arg}` for the snippet form.
 */
export function createContent(option, arg, fallback, snippet) {
    if (snippet) {
        return {snippet, arg: arg?.()};
    }

    let content = isFunction(option) ? option(arg?.()) : option;

    return {content: content ?? (isFunction(fallback) ? fallback() : fallback)};
}
