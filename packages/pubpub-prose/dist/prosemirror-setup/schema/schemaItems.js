"use strict";

var _require = require("prosemirror-model"),
    Schema = _require.Schema;

// :: Object
//
//   doc:: NodeSpec The top level document node.
//
//   paragraph:: NodeSpec A plain paragraph textblock.
//
//   blockquote:: NodeSpec A blockquote wrapping one or more blocks.
//
//   horizontal_rule:: NodeSpec A horizontal rule.
//
//   heading:: NodeSpec A heading textblock, with a `level`
//   attribute that should hold the number 1 to 6.
//
//   code_block:: NodeSpec A code listing. Disallows marks or
//   non-text inline nodes by default.
//
//   text:: NodeSpec The text node.
//
//   image:: NodeSpec An inline image node. Supports `src`, `alt`, and
//   `href` attributes. The latter two default to the empty string.
//
//   hard_break:: NodeSpec A hard line break.


var nodes = {

  doc: {
    content: "article citations",
    attrs: {
      meta: { default: {} }
    }
  },

  article: {
    content: "block+",
    parseDOM: [{ tag: "div.article" }],
    toDOM: function toDOM(node) {
      return ["div", { class: 'article' }, 0];
    }
  },

  paragraph: {
    content: "inline<_>*",
    group: "block",
    parseDOM: [{ tag: "p" }],
    toDOM: function toDOM() {
      return ["p", 0];
    }
  },

  highlight: {
    group: 'inline',
    content: "text*",
    /*
    attrs: {
      content: {default: ''},
    },
    */
    inline: true
  },

  mention: {
    group: 'inline',
    attrs: {
      text: { default: '' },
      meta: { default: {} },
      type: { default: '' }
    },
    inline: true
  },

  equation: {
    group: 'inline',
    content: "inline<_>*",
    attrs: {
      content: { default: '' }
    },
    inline: true
  },

  block_equation: {
    group: 'block',
    content: "inline<_>*",
    attrs: {
      content: { default: '' }
    }
  },

  citations: {
    content: "citation*",
    group: "footer",
    parseDOM: [{ tag: "hr.citations" }],
    selectable: false,
    toDOM: function toDOM() {
      return ["div", ["hr"]];
    }
  },

  citation: {
    attrs: {
      data: { default: {} },
      citationID: { default: null }
    },
    group: "footer",
    selectable: false,
    toDOM: function toDOM() {
      return ["div"];
    }
  },

  reference: {
    inline: true,
    attrs: {
      citationID: { default: null },
      referenceID: { default: null }
    },
    group: "inline"

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
    content: "caption?",
    attrs: {
      filename: { default: '' },
      url: { default: '' },
      figureName: { default: '' },
      size: { default: '' },
      align: { default: '' }
    },
    inline: false,
    group: 'block',
    draggable: false,
    selectable: true
  },

  figure: {
    /*
    attrs: {
      size, image, etc.
    }
    */
    content: "embed caption",
    group: "block"
  },

  caption: {
    content: "inline<_>*",
    group: "block",
    parseDOM: [{ tag: "p" }],
    toDOM: function toDOM() {
      return ["p", 0];
    }
  },

  aside: {
    content: "inline<_>*",
    group: "block",
    parseDOM: [{ tag: "aside" }],
    toDOM: function toDOM() {
      return ["aside"];
    }
  },

  blockquote: {
    content: "block+",
    group: "block",
    parseDOM: [{ tag: "blockquote" }],
    toDOM: function toDOM() {
      return ["blockquote", 0];
    }
  },

  horizontal_rule: {
    group: "block",
    parseDOM: [{ tag: "hr" }],
    toDOM: function toDOM() {
      return ["div", ["hr"]];
    }
  },

  heading: {
    attrs: { level: { default: 1 } },
    content: "inline<_>*",
    group: "block",
    parseDOM: [{ tag: "h1", attrs: { level: 1 } }, { tag: "h2", attrs: { level: 2 } }, { tag: "h3", attrs: { level: 3 } }, { tag: "h4", attrs: { level: 4 } }, { tag: "h5", attrs: { level: 5 } }, { tag: "h6", attrs: { level: 6 } }],
    toDOM: function toDOM(node) {
      return ["h" + node.attrs.level, 0];
    }
  },

  code_block: {
    content: "text*",
    group: "block",
    code: true,
    parseDOM: [{ tag: "pre", preserveWhitespace: true }],
    toDOM: function toDOM() {
      return ["pre", ["code", 0]];
    }
  },

  text: {
    group: "inline",
    toDOM: function toDOM(node) {
      return node.text;
    }
  },

  image: {
    inline: true,
    attrs: {
      src: {},
      alt: { default: null },
      title: { default: null }
    },
    group: "inline",
    draggable: true,
    parseDOM: [{ tag: "img[src]", getAttrs: function getAttrs(dom) {
        return {
          src: dom.getAttribute("src"),
          title: dom.getAttribute("title"),
          alt: dom.getAttribute("alt")
        };
      }
    }],
    toDOM: function toDOM(node) {
      return ["img", node.attrs];
    }
  },

  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{ tag: "br" }],
    toDOM: function toDOM() {
      return ["br"];
    }
  }
};
exports.nodes = nodes;

// :: Object
//
//  em:: MarkSpec An emphasis mark.
//
//  strong:: MarkSpec A strong mark.
//
//  link:: MarkSpec A link. Has `href` and `title` attributes.
//  `title` defaults to the empty string.
//
//  code:: MarkSpec Code font mark.
var marks = {
  em: {
    parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style", getAttrs: function getAttrs(value) {
        return value == "italic" && null;
      } }],
    toDOM: function toDOM() {
      return ["em"];
    }
  },

  strong: {
    parseDOM: [{ tag: "strong" },
    // This works around a Google Docs misbehavior where
    // pasted content will be inexplicably wrapped in `<b>`
    // tags with a font-weight normal.
    { tag: "b", getAttrs: function getAttrs(node) {
        return node.style.fontWeight != "normal" && null;
      } }, { style: "font-weight", getAttrs: function getAttrs(value) {
        return (/^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
        );
      } }],
    toDOM: function toDOM() {
      return ["strong"];
    }
  },

  link: {
    attrs: {
      href: { default: '' },
      title: { default: null }
    },
    parseDOM: [{ tag: "a[href]", getAttrs: function getAttrs(dom) {
        return { href: dom.getAttribute("href"), title: dom.getAttribute("title") };
      }
    }],
    toDOM: function toDOM(node) {
      return ["a", node.attrs];
    }
  },

  code: {
    parseDOM: [{ tag: "code" }],
    toDOM: function toDOM() {
      return ["code"];
    }
  }
};
exports.marks = marks;

// :: Schema
// This schema rougly corresponds to the document schema used by
// CommonMark, minus the list elements, which are defined in the
// [schema-list](#schema-list) module.
//
// To reuse elements from this schema, extend or read from its
// [`nodeSpec`](#model.Schema.nodeSpec) and
// [`markSpec`](#model.Schema.markSpec) properties.
var schema = new Schema({ nodes: nodes, marks: marks, topNode: "doc" });
exports.schema = schema;