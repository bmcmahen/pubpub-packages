'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.markdownParser = undefined;

var _references = require('../references');

var _prosemirrorMarkdown = require('prosemirror-markdown');

var _prosemirrorModel = require('prosemirror-model');

var _markdownitInstance = require('./markdownitInstance');

var _markdownitInstance2 = _interopRequireDefault(_markdownitInstance);

var _schema = require('../prosemirror-setup/schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var markdownSchema = _schema.schema;

var markdownParser = exports.markdownParser = new _prosemirrorMarkdown.MarkdownParser(markdownSchema, _markdownitInstance2.default, {
	article: { block: 'article' },

	blockquote: { block: 'blockquote' },
	paragraph: { block: 'paragraph' },
	list_item: { block: 'list_item' },
	bullet_list: { block: 'bullet_list' },
	ordered_list: { block: 'ordered_list', attrs: function attrs(tok) {
			return { order: +tok.attrGet('order') || 1 };
		} },
	heading: { block: 'heading', attrs: function attrs(tok) {
			return { level: +tok.tag.slice(1) };
		} },
	code_block: { block: 'code_block' },
	fence: { block: 'code_block' },
	html_inline: { node: 'code_block' },
	html_block: { node: 'html_block', attrs: function attrs(tok) {
			return { content: tok.content };
		} },

	hr: { node: 'horizontal_rule' },
	pagebreak: { node: 'page_break' },
	math_inline: { node: 'equation', attrs: function attrs(tok) {
			return { content: tok.content };
		} },
	math_block: { node: 'block_equation', attrs: function attrs(tok) {
			return { content: tok.content };
		} },

	image: { node: 'embed' },
	highlight: { node: 'highlight', attrs: function attrs(tok) {
			return { highlightID: tok.attrGet('highlightID') };
		} },
	footnote_ref: { node: 'footnote', attrs: function attrs(tok) {
			return {
				label: tok.attrGet('label'),
				content: tok.attrGet('content')
			};
		} },
	embed: { node: 'embed' },
	emoji: { node: 'emoji', attrs: function attrs(tok) {
			return {
				content: tok.content,
				markup: tok.markup
			};
		} },
	hardbreak: { node: 'hard_break' },

	citations: { node: 'citations' },

	table: { block: 'table' },
	tbody: { block: 'none' },
	thead: { block: 'none' },

	tr: { block: 'table_row' },
	td: { block: 'table_cell' },
	th: { block: 'table_cell' },

	em: { mark: 'em' },
	strong: { mark: 'strong' },
	strike: { mark: 'strike' },
	s: { mark: 'strike' },

	reference: { node: 'reference' },

	link: { block: 'mention', attrs: function attrs(tok) {
			var text = void 0,
			    type = void 0,
			    link = void 0;
			var titleAttr = tok.attrGet('title');
			var hrefAttr = tok.attrGet('href');
			if (title && title.charAt(0) === '@') {
				type = 'reference';
				text = 'reference';
				url = hrefAttr;
			} else {
				type = 'normal';
				text = titleAttr;
				url = hrefAttr;
			}

			return { type: type, text: text, url: url };
		}
	},
	code_inline: { mark: 'code' },
	sub: { mark: 'sub' },
	sup: { mark: 'sup' }
});

var emptyAdd = function emptyAdd(state, tok) {
	// console.log('emptying', tok);
};

function attrs(given, token) {
	return given instanceof Function ? given(token) : given;
}

var addParagraph = function addParagraph(state, tok) {
	state.columns = state.columns + 1;
	state.openNode(markdownSchema.nodeType("table_cell"), attrs({}, tok));
	state.openNode(markdownSchema.nodeType("paragraph"), attrs({}, tok));
};

var stopParagraph = function stopParagraph(state) {
	state.closeNode();
	state.closeNode();
};

var openTable = function openTable(state, tok) {
	state.rows = 0;
	state.openNode(markdownSchema.nodeType("table"), attrs({}, tok));
};

var closeTable = function closeTable(state, tok) {
	var rows = state.rows;
	// the attribute in the tables schema is columns, but it should mean rows
	// so we use the word rows but assign the column attribute
	state.top().attrs.columns = rows;
	state.closeNode();
};

var openRow = function openRow(state, tok) {
	state.columns = 0;
	state.rows = state.rows + 1;
	state.openNode(markdownSchema.nodeType("table_row"), attrs({}, tok));
};

var closeRow = function closeRow(state, tok) {
	var columns = state.columns;
	state.top().attrs.columns = columns;
	state.closeNode();
};

var addEmbed = function addEmbed(state, tok) {
	var topNode = state.top();
	var didClose = false;
	if (topNode.type.name === 'paragraph') {
		didClose = true;
		state.closeNode();
	}
	var attrs = {
		filename: tok.attrGet('src'),
		size: tok.attrGet('width'),
		align: tok.attrGet('align')
	};
	var caption = tok.content;

	state.openNode(markdownSchema.nodeType('embed'), attrs);
	if (caption && caption.length > 0) {
		var textnode = markdownSchema.text(caption);
		state.addNode(markdownSchema.nodeType('caption'), {}, textnode);
	}

	state.closeNode();

	if (didClose) {
		state.openNode(topNode.type, topNode.attrs);
	}
};

var addReference = function addReference(state, tok) {

	if (!state.citationsDict) {
		state.citationsDict = {};
		state.citationOrder = [];
	}

	var citationID = tok.attrGet('citationID').slice(1);
	if (!state.citationsDict[citationID]) {
		state.citationOrder.push(citationID);
	}

	var attrs = { citationID: citationID };
	state.addNode(markdownSchema.nodeType('reference'), attrs);
};

var addCitations = function addCitations(state, tok) {

	var orderedCitations = state.citationOrder || [];
	state.openNode(markdownSchema.nodeType('citations'), {});

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = orderedCitations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var citationID = _step.value;

			state.addNode(markdownSchema.nodeType('citation'), { citationID: citationID });
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	state.closeNode();
};

var addMention = function addMention(state, tok) {
	var type = void 0,
	    url = void 0;
	var hrefAttr = tok.attrGet('href');
	type = 'normal';
	url = hrefAttr;
	var attrs = { type: type, url: url };
	state.openNode(markdownSchema.nodeType('mention'), attrs);
};

/*
const addFootnote = function(state, tok) {
	let type, url;
	const footnoteId = tok.meta.id;
	console.log(state);
	const tokens = state.env.footnotes.list[footnoteId];
	console.log('tokens!!!', tokens);
	state.addNode(markdownSchema.nodeType('footnote'), { content: 'a' });
};

markdownParser.tokenHandlers.footnote_ref = addFootnote;
*/
markdownParser.tokenHandlers.image = addEmbed;
markdownParser.tokenHandlers.reference = addReference;
markdownParser.tokenHandlers.citations = addCitations;

markdownParser.tokenHandlers.table_open = openTable;
markdownParser.tokenHandlers.table_close = closeTable;

markdownParser.tokenHandlers.tr_open = openRow;
markdownParser.tokenHandlers.tr_close = closeRow;

markdownParser.tokenHandlers.th_open = addParagraph;
markdownParser.tokenHandlers.td_open = addParagraph;

markdownParser.tokenHandlers.th_close = stopParagraph;
markdownParser.tokenHandlers.td_close = stopParagraph;

markdownParser.tokenHandlers.link_open = addMention;

markdownParser.tokenHandlers.tbody_open = emptyAdd;
markdownParser.tokenHandlers.tbody_close = emptyAdd;
markdownParser.tokenHandlers.thead_open = emptyAdd;
markdownParser.tokenHandlers.thead_close = emptyAdd;

markdownParser._parse = markdownParser.parse;

markdownParser.parse = function (md, localReferences) {
	var result = markdownParser._parse(md);
	return result;
};

markdownParser.parseSlice = function (md) {
	return markdownParser.parse(md);
};