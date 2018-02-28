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
 * Replaces whitespace in template literal tag
 * @param {Map<RegExp, string>} replacements - RegExes paired with replacement values
 * @param {Array<TemplateElement>} quasis - Template literal elements
 */
function transform(replacements, quasis) {
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
			TaggedTemplateExpression: path => {
				/**
				 * Regex find and replacements
				 * (Some of these rules overlap, but that's OK)
				 * @type {Map<RegExp, string>}
				 */
				const replacements = new Map();

				if (t.isIdentifier(path.node.tag, { name: 'spaceless' })) {
					replacements.set(/[\n\r\t ]/g, ' ');
				} else if (t.isIdentifier(path.node.tag, { name: 'inline' })) {
					/**
					 * This regex was stolen from common-tags. Hooray for open-source!
					 * {@link https://github.com/declandewet/common-tags/blob/master/src/oneLine/oneLine.js#L6}
					 */
					replacements.set(/(?:\n(?:\s*))+/g, ' ');
				}

				/// More replacements can be included here in the future

				if (replacements.size > 0) {
					transform(replacements, path.node.quasi.quasis);

					return path.replaceWith(path.node.quasi);
				}
			}
		}
	};
};
