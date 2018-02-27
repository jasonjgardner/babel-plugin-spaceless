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
 * Replaces whitespace in template literal tag
 * @param {Array<TemplateElement>} quasis - Template literal elements
 */
function transform(quasis) {
	const replacements = new Map();
	replacements.set(/[\n\r\t ]+</g, ' <'); /// Replace whitespace between tags
	replacements.set(/([a-z]+)>[\n\r\t ]+/g, '$1>'); /// Replace whitespace after open tag
	replacements.set(/>[\n\r\t ]+<(\/)?/ig, '><$1'); /// Replace whitespace between closing tags
	replacements.set(/[\n\r\t ]+</g, '<'); /// Replace whitespace before closing tags
	//replacements.set(/[\n\r\t ]+/g, ' '); /// Replace whitespace between tags

	for (let [find, replace] of replacements.entries()) {
		quasis.forEach(element /** @type TemplateElement */ => {
			element.value.raw = element.value.raw.replace(find, replace).trim();
			element.value.cooked = element.value.cooked.replace(find, replace).trim();
		});
	}
}

module.exports = ({ types: t }) => {
	return {
		visitor: {
			TaggedTemplateExpression: path => {
				const node = path.node;

				if (t.isIdentifier(node.tag, { name: IDENTIFIER })) {
					transform(node.quasi.quasis);
					return path.replaceWith(node.quasi);
				}
			}
		}
	};
};
