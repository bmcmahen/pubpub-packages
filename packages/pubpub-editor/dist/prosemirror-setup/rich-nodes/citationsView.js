'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _docOperations = require('../../utils/doc-operations');

var _components = require('./components');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactview = require('./reactview');

var _reactview2 = _interopRequireDefault(_reactview);

var _plugins = require('../plugins');

var _schema = require('../schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CitationsView = function (_ReactView) {
  _inherits(CitationsView, _ReactView);

  function CitationsView(node, view, getPos, options) {
    _classCallCheck(this, CitationsView);

    return _possibleConstructorReturn(this, (CitationsView.__proto__ || Object.getPrototypeOf(CitationsView)).call(this, node, view, getPos, options));
  }

  _createClass(CitationsView, [{
    key: 'bindFunctions',
    value: function bindFunctions() {
      this.valueChanged = this.valueChanged.bind(this);
      this.getBibliography = this.getBibliography.bind(this);
      this.deleteItem = this.deleteItem.bind(this);

      _get(CitationsView.prototype.__proto__ || Object.getPrototypeOf(CitationsView.prototype), 'bindFunctions', this).call(this);
    }
  }, {
    key: 'getBibliography',
    value: function getBibliography(citationData, citationIDs) {
      return (0, _plugins.getPlugin)('citations', this.view.state).props.getBibliography(this.view.state, citationData, citationIDs);
    }
  }, {
    key: 'renderElement',
    value: function renderElement(domChild) {
      var node = this.node;
      var citations = this.getChildren();
      // updateParams={this.updateNodeParams} {...node.attrs}
      return _reactDom2.default.render(_react2.default.createElement(_components.CitationsComponent, _extends({
        getBibliography: this.getBibliography,
        citations: citations,
        updateValue: this.valueChanged,
        deleteItem: this.deleteItem,
        value: this.value }, node.attrs)), domChild);
    }
  }, {
    key: 'deleteItem',
    value: function deleteItem(bibItem) {
      var childPos = this.getChildNode(bibItem);
      if (childPos) {
        var transaction = this.view.state.tr.delete(childPos.from, childPos.to);
        this.view.dispatch(transaction);
      }
    }
  }, {
    key: 'getCitationOrder',
    value: function getCitationOrder() {
      var referenceNodes = (0, _docOperations.findNodes)(this.view.state.doc, 'reference');
      var sortedIDs = referenceNodes.map(function (subNode) {
        return subNode.attrs.citationID;
      });
      return sortedIDs;
    }
  }, {
    key: 'getChildNode',
    value: function getChildNode(bibItem) {
      var foundNode = (0, _docOperations.findNodeByFunc)(this.node, function (_node) {
        return _node.attrs.data.id === bibItem.id;
      });
      if (!foundNode) {
        console.log('could not find textnode', foundNode);
        return null;
      }
      var from = this.getPos() + foundNode.index + 1;
      var to = from + foundNode.node.nodeSize;
      return { from: from, to: to };
    }
  }, {
    key: 'getChildren',
    value: function getChildren() {
      var node = this.node;
      var children = [];
      var childNodes = node.content.content.map(function (subNode) {
        return subNode.attrs;
      });

      // gets the order of citations in the document, and then sorts it by that order
      var citationOrder = this.getCitationOrder();

      var filteredNodes = childNodes.filter(function (node) {
        var nodeIndex = citationOrder.indexOf(node.citationID);
        return nodeIndex !== -1;
      });

      filteredNodes.sort(function (a, b) {
        var aIndex = citationOrder.indexOf(a.citationID);
        var bIndex = citationOrder.indexOf(b.citationID);
        return aIndex - bIndex;
      });
      return filteredNodes;
    }
  }, {
    key: 'selectNode',
    value: function selectNode() {
      this.reactElement.setSelected(true);
    }
  }, {
    key: 'deselectNode',
    value: function deselectNode() {
      this.reactElement.setSelected(false);
    }
  }]);

  return CitationsView;
}(_reactview2.default);

exports.default = CitationsView;