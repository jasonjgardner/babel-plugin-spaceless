#!/usr/bin/env node --harmony
/**
 * babel-plugin-spaceless
 * Removes excess whitespace found in template tags
 * Based on {@link https://engineering.webengage.com/2016/07/15/babel/ WebEngage article}
 * @author Jason Gardner
 * @licence MIT
 */

'use strict';

/**
 * Template tag function name
 * @type {string}
 */
const IDENTIFIER = 'spaceless';

/**
 * Get a Map of RegEx replacements according to plugin settings
 * @param {Object.<string, boolean>} options - Babel plugin options
 * @returns {Map<RegExp, string>}
 */
function getReplacements(options) {
	/**
	 * Checks if an option has been enabled.
	 * Enables default replacements
	 * @param {string} key - Option name
	 * @param {boolean} enableDefault - Set to `true` to enable the rule by default
	 * @returns {boolean} Returns `true` if the option is enabled
	 */
	const isEnabled = (key, enableDefault) => {
		if (enableDefault) {
			return !options.hasOwnProperty(key) || options[key] !== false;
		}

		/// Explicitly enable
		return options.hasOwnProperty(key) && options[key] === true;
	};

	/**
	 * Regex find and replacements
	 * (Some of these rules overlap, but that's OK)
	 * @type {Map<RegExp, string>}
	 */
	const replacements = new Map();

	/// Remove new lines - Enabled by default
	if (isEnabled('remove-new-lines', true)) {
		replacements.set(/[\n\r]+/g, '');
	}

	/// Replace whitespace before tags - Enabled by default
	if (isEnabled('remove-before-tags', true)) {
		replacements.set(/[\n\r\t ]+</g, '<');
	}

	/// Replace whitespace between closing tags - Enabled by default
	if (isEnabled('remove-between-tags', true)) {
		replacements.set(/>[\n\r\t ]+<(\/)?/ig, '><$1');
	}

	/// Replace whitespace before closing tags - Enabled by default
	if (isEnabled('remove-before-close', true)) {
		replacements.set(/[\n\r\t ]+<\//ig, '</');
	}

	/// Replace whitespace after closing tags - Enabled by default
	/// (Excludes inline HTML tags)
	if (isEnabled('remove-after-close', true)) {
		replacements.set(
			/<\/(?!a|b|i|u|s|q|em|rt|rp|strong|small|abbr|cite|dfn|sub|sup|time|code|kbd|samp|var|mark|bdi|bdo|ruby|span)([a-z0-9-]*[a-z0-9'"]+)>[\r\n\t ]+/ig,
			'</$1>'
		);
	}

	/// Replace whitespace after opening tag - Disabled by default
	if (isEnabled('remove-after-open', false)) {
		replacements.set(/<([a-z0-9-]*[a-z0-9'"]+)>[\n\r\t ]+/g, '<$1>');
	}

	/// Replace excess whitespace anywhere in contents - Disabled by default
	if (isEnabled('remove-in-content', false)) {
		replacements.set(/[\n\r\t ]+/g, ' ');
	}

	return replacements;
}

/**
 * Replaces whitespace in template literal tag
 * @param {Array<TemplateElement>} quasis - Template literal elements
 * @param {{opts:Object<string, boolean>}} state
 */
function transform(quasis, state) {
	const replacements = getReplacements(state.opts);

	for (let [find, replace] of replacements.entries()) {
		for (let val of ['raw', 'cooked']) {
			for (let element of quasis) {
				element.value[val] = element.value[val].replace(find, replace);
			}
		}
	}
}

module.exports = ({ types: t }) => {
	return {
		visitor: {
			TaggedTemplateExpression: (path, state) => {
				if (t.isIdentifier(path.node.tag, { name: IDENTIFIER })) {
					transform(path.node.quasi.quasis, state);

					return path.replaceWith(path.node.quasi);
				}
			}
		}
	};
};
