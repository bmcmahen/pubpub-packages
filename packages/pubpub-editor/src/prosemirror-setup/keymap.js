const { wrapIn, setBlockType, chainCommands, newlineInCode, toggleMark } = require('prosemirror-commands');
const { selectNextCell, selectPreviousCell } = require('prosemirror-schema-table');
const { wrapInList, splitListItem, liftListItem, sinkListItem } = require('prosemirror-schema-list');
const { undo, redo } = require('prosemirror-history');
// const { Selection, TextSelection } = require('prosemirror-state');
const mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;

// :: (Schema, ?Object) → Object
// Inspect the given schema looking for marks and nodes from the
// basic schema, and if found, add key bindings related to them.
// This will add:
//
// * **Mod-b** for toggling [strong](#schema-basic.StrongMark)
// * **Mod-i** for toggling [emphasis](#schema-basic.EmMark)
// * **Mod-`** for toggling [code font](#schema-basic.CodeMark)
// * **Ctrl-Shift-0** for making the current textblock a paragraph
// * **Ctrl-Shift-1** to **Ctrl-Shift-Digit6** for making the current
//   textblock a heading of the corresponding level
// * **Ctrl-Shift-Backslash** to make the current textblock a code block
// * **Ctrl-Shift-8** to wrap the selection in an ordered list
// * **Ctrl-Shift-9** to wrap the selection in a bullet list
// * **Ctrl->** to wrap the selection in a block quote
// * **Enter** to split a non-empty textblock in a list item while at
//   the same time splitting the list item
// * **Mod-Enter** to insert a hard break
// * **Mod-_** to insert a horizontal rule
//
// You can suppress or map these bindings by passing a `mapKeys`
// argument, which maps key names (say `'Mod-B'` to either `false`, to
// remove the binding, or a new key name string.
function buildKeymap(schema, mapKeys) {
	const keys = {};
	let type;
	function bind(key, cmd) {
		if (mapKeys) {
			const mapped = mapKeys[key];
			if (mapped === false) return;
			if (mapped) key = mapped;
		}
		keys[key] = cmd;
	}

	bind('Mod-z', undo);
	bind('Shift-Mod-z', redo);
	if (!mac) bind('Mod-y', redo);

	if (type = schema.marks.strong) {
		bind('Mod-b', toggleMark(type));
	}
	if (type = schema.marks.em) {
		bind('Mod-i', toggleMark(type));
	}
	if (type = schema.marks.code) {
		bind('Mod-`', toggleMark(type));
	}

	if (type = schema.nodes.bullet_list) {
		bind('Shift-Ctrl-8', wrapInList(type));
	}

	if (type = schema.nodes.ordered_list) {
		bind('Shift-Ctrl-9', wrapInList(type));
	}

	if (type = schema.nodes.blockquote) {
		bind('Ctrl->', wrapIn(type));
	}

	if (type = schema.nodes.hard_break) {
		const br = type;
		const cmd = chainCommands(newlineInCode, (state, onAction) => {
			onAction(state.tr.replaceSelectionWith(br.create()).scrollAction());
			return true;
		});
		bind('Mod-Enter', cmd);
		bind('Shift-Enter', cmd);
		if (mac) bind('Ctrl-Enter', cmd);
	}

	if (type = schema.nodes.list_item) {
		bind('Enter', splitListItem(type));
		bind('Mod-[', liftListItem(type));
		bind('Mod-]', sinkListItem(type));
	}

	if (type = schema.nodes.paragraph) {
		bind('Shift-Ctrl-0', setBlockType(type));
	}

	if (type = schema.nodes.code_block) {
		bind('Shift-Ctrl-\\', setBlockType(type));
	}

	if (type = schema.nodes.heading) {
		for (let index = 1; index <= 6; index++) bind('Shift-Ctrl-' + index, setBlockType(type, { level: index }));
	}

	if (type = schema.nodes.horizontal_rule) {
		const hr = type;
		bind('Mod-_', (state, onAction) => {
			onAction(state.tr.replaceSelectionWith(hr.create()).scrollAction());
			return true;
		});
	}

	/*
	if (schema.nodes.citations) {
		bind("ArrowDown", (state, onAction) => {
			onAction(state.tr.replaceSelectionWith(hr.create()).scrollAction())
			return true
		})
	}
	*/

	if (schema.nodes.table_row) {
		bind('Tab', selectNextCell);
		bind('Shift-Tab', selectPreviousCell);
	}

	// if (false) {
		// bind('@', (state, onAction) => {
		//   const sel = state.selection;
		//   if (!sel.empty) {
		//     return false;
		//   }
		//   const doc = state.doc;
		//   const pos = sel.$from.pos;
		//   const txt = doc.textBetween(pos - 1, pos, '|', '|');
		//   if (txt.trim() !== '') {
		//     return false;
		//   }

		//   const newSelection = TextSelection.create(state.doc, sel.from, sel.from);
		//   let transaction = state.tr.replaceSelectionWith(schema.nodes.mention.create({editing: true}));
		//   transaction = transaction.setSelection(newSelection);
		//   const result = onAction(transaction);
		//   return true
		// })

		// bind('ArrowLeft', (state, onAction) => {
		//   const sel = state.selection;
		//   if (!sel.empty) {
		//     return false;
		//   }
		//   const doc = state.doc;
		//   const pos = sel.$from.pos;
		//   const txt = doc.textBetween(pos - 2, pos, '|', '|');
		//   console.log(txt)
		//   if (txt === ' @') {
		//     console.log('GOT THAT TEXT');
		//   }
		//   return false;
		// })
	// }
	return keys;
}

exports.buildKeymap = buildKeymap;
