'use strict';

var _require = require('prosemirror-model'),
    Schema = _require.Schema;

var nodes = {

	doc: {
		content: 'article citations',
		attrs: {
			meta: { default: {} }
		}
	},

	article: {
		content: 'block+',
		parseDOM: [{ tag: 'div.article' }],
		toDOM: function toDOM(node) {
			return ['div', { class: 'article' }, 0];
		}
	},

	paragraph: {
		content: 'inline<_>*',
		group: 'block',
		parseDOM: [{ tag: 'p' }],
		toDOM: function toDOM() {
			return ['p', 0];
		}
	},

	highlight: {
		group: 'inline',
		inline: true,
		attrs: {
			highlightID: { default: null }
		},
		toDOM: function toDOM() {
			return ['div', 0];
		}
	},

	mention: {
		content: 'inline<_>*',
		atom: true,
		group: 'inline',
		attrs: {
			url: { default: '' },
			type: { default: ' ' }
		},
		inline: true
	},

	equation: {
		atom: true,
		group: 'inline',
		content: 'inline<_>*',
		attrs: {
			content: { default: '' }
		},
		inline: true
	},

	block_equation: {
		atom: true,
		group: 'block',
		content: 'inline<_>*',
		attrs: {
			content: { default: '' }
		}
	},

	citations: {
		atom: true,
		content: 'citation*',
		group: 'footer',
		parseDOM: [{ tag: 'hr.citations' }],
		selectable: false,
		toDOM: function toDOM() {
			return ['div', ['hr']];
		}
	},

	citation: {
		attrs: {
			data: { default: {} },
			citationID: { default: null }
		},
		group: 'footer',
		selectable: false,
		toDOM: function toDOM() {
			return ['div'];
		}
	},

	reference: {
		atom: true,
		inline: true,
		attrs: {
			citationID: { default: null },
			referenceID: { default: null }
		},
		group: 'inline'

	},

	iframe: {
		attrs: {
			url: { default: null },
			height: { default: null },
			width: { default: null }
		},
		group: 'block'
	},

	embed: {
		atom: true,
		content: 'caption?',
		attrs: {
			filename: { default: '' },
			url: { default: '' },
			figureName: { default: '' },
			size: { default: '' },
			align: { default: '' }
		},
		parseDOM: [{ tag: 'img[src]' }],
		inline: false,
		group: 'block',
		draggable: false,
		selectable: true
	},

	caption: {
		content: 'inline<_>*',
		group: 'block',
		parseDOM: [{ tag: 'p' }],
		toDOM: function toDOM() {
			return ['p', 0];
		}
	},

	// removable, but think some legacy docs may use this
	aside: {
		content: 'inline<_>*',
		group: 'block',
		parseDOM: [{ tag: 'aside' }],
		toDOM: function toDOM() {
			return ['aside'];
		}
	},

	footnote: {
		atom: true,
		inline: true,
		attrs: {
			content: { default: '' }
		},
		group: 'inline',
		parseDOM: [{ tag: 'aside' }],
		toDOM: function toDOM() {
			return ['aside'];
		}
	},

	blockquote: {
		content: 'block+',
		group: 'block',
		parseDOM: [{ tag: 'blockquote' }],
		toDOM: function toDOM() {
			return ['blockquote', 0];
		}
	},

	horizontal_rule: {
		group: 'block',
		parseDOM: [{ tag: 'hr' }],
		toDOM: function toDOM() {
			return ['div', ['hr']];
		}
	},

	heading: {
		attrs: { level: { default: 1 } },
		content: 'inline<_>*',
		group: 'block',
		parseDOM: [{ tag: 'h1', attrs: { level: 1 } }, { tag: 'h2', attrs: { level: 2 } }, { tag: 'h3', attrs: { level: 3 } }, { tag: 'h4', attrs: { level: 4 } }, { tag: 'h5', attrs: { level: 5 } }, { tag: 'h6', attrs: { level: 6 } }],
		toDOM: function toDOM(node) {
			return ['h' + node.attrs.level, 0];
		}
	},

	code_block: {
		content: 'text*',
		group: 'block',
		code: true,
		parseDOM: [{ tag: 'pre', preserveWhitespace: true }],
		toDOM: function toDOM() {
			return ['pre', ['code', 0]];
		}
	},

	html_block: {
		atom: true,
		attrs: {
			content: { default: '' }
		},
		parseDOM: [{ tag: 'div.customHTML' }],
		inline: false,
		group: 'block',
		draggable: false,
		selectable: true
	},

	text: {
		group: 'inline',
		toDOM: function toDOM(node) {
			return node.text;
		}
	},

	/*
 image: {
 	inline: true,
 	attrs: {
 		src: {},
 		alt: { default: null },
 		title: { default: nul l}
 	},
 	group: 'inline',
 	draggable: true,
 	parseDOM: [{tag: 'img[src]', getAttrs(dom) {
 		return {
 			src: dom.getAttribute('src'),
 			title: dom.getAttribute('title'),
 			alt: dom.getAttribute('alt')
 		}
 	}}],
 	toDOM(node) { return ['img', node.attrs]; }
 },
 */

	hard_break: {
		inline: true,
		group: 'inline',
		selectable: false,
		parseDOM: [{ tag: 'br' }],
		toDOM: function toDOM() {
			return ['br'];
		}
	},

	// empty schema block
	none: {
		group: 'block',
		toDOM: function toDOM() {
			return ['span'];
		}
	}

};

var marks = {
	em: {
		parseDOM: [{ tag: 'i' }, { tag: 'em' }, {
			style: 'font-style',
			getAttrs: function getAttrs(value) {
				return value === 'italic' && null;
			}
		}],
		toDOM: function toDOM() {
			return ['em'];
		}
	},

	strong: {
		parseDOM: [{ tag: 'strong' },
		// This works around a Google Docs misbehavior where
		// pasted content will be inexplicably wrapped in `<b>`
		// tags with a font-weight normal.
		{ tag: 'b', getAttrs: function getAttrs(node) {
				return node.style.fontWeight !== 'normal' && null;
			} }, { style: 'font-weight', getAttrs: function getAttrs(value) {
				return (/^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
				);
			} }],
		toDOM: function toDOM() {
			return ['strong'];
		}
	},

	link: {
		attrs: {
			href: { default: '' },
			title: { default: null }
		},
		parseDOM: [{
			tag: 'a[href]',
			getAttrs: function getAttrs(dom) {
				return { href: dom.getAttribute('href'), title: dom.getAttribute('title') };
			}
		}],
		toDOM: function toDOM(node) {
			return ['a', node.attrs];
		}
	},

	code: {
		parseDOM: [{ tag: 'code' }],
		toDOM: function toDOM() {
			return ['code'];
		}
	}
};

var schema = new Schema({ nodes: nodes, marks: marks, topNode: 'doc' });

exports.schema = schema;
exports.marks = marks;
exports.nodes = nodes;