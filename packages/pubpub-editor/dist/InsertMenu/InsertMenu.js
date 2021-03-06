'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.InsertMenu = undefined;

var _core = require('@blueprintjs/core');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _insertMenuConfig = require('./insertMenuConfig');

var _insertMenuConfig2 = _interopRequireDefault(_insertMenuConfig);

var _InsertMenuDialogFiles = require('./InsertMenuDialogFiles');

var _InsertMenuDialogFiles2 = _interopRequireDefault(_InsertMenuDialogFiles);

var _InsertMenuDialogReferences = require('./InsertMenuDialogReferences');

var _InsertMenuDialogReferences2 = _interopRequireDefault(_InsertMenuDialogReferences);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = void 0;

var InsertMenu = exports.InsertMenu = _react2.default.createClass({
	displayName: 'InsertMenu',

	propTypes: {
		editor: _react.PropTypes.object,
		top: _react.PropTypes.number,
		handleFileUpload: _react.PropTypes.func,
		handleReferenceAdd: _react.PropTypes.func,
		allReferences: _react.PropTypes.array
	},

	getInitialState: function getInitialState() {
		return {
			openDialog: undefined,
			callback: undefined,
			top: null
		};
	},
	updatePosition: function updatePosition(view) {

		var container = document.getElementById('rich-editor-container');
		var canUse = (0, _insertMenuConfig.canUseInsertMenu)(view);
		var sel = view.state.selection;
		var currentPos = sel.$to.pos;

		if (sel.empty && canUse) {
			this.setState({ top: view.coordsAtPos(currentPos).top - container.getBoundingClientRect().top + 5 });
		} else {
			this.setState({ top: null });
		}
	},


	openDialog: function openDialog(dialogType, callback) {
		this.setState({
			openDialog: dialogType,
			callback: callback
		});
	},

	closeDialog: function closeDialog() {
		this.setState({
			openDialog: undefined,
			callback: undefined
		});
	},

	onFileSelect: function onFileSelect(evt) {
		var _this = this;

		// Need to upload file
		// Need to add new file object to file list
		// Need to insert file content into editor
		var file = evt.target.files[0];
		evt.target.value = null;
		this.props.handleFileUpload(file, function (filename, url) {
			// insertEmbed(filename);
			_this.state.callback(filename, url); // This shouldn't use the callback - it should import the function rom insertMenu and call it.

			_this.setState({
				openDialog: undefined,
				callback: undefined
			});
		});
	},

	onReferenceAdd: function onReferenceAdd(item) {
		var _this2 = this;

		// Need to update or create bibtex file
		// Need to make sure that updated file is sent to editor props
		// Need to call inserReference function

		var existingReference = this.props.allReferences.find(function (reference) {
			if (reference.id === item.id) {
				return true;
			}
			return false;
		});

		if (existingReference) {
			this.state.callback(item);
			this.setState({
				openDialog: undefined,
				callback: undefined
			});
			return;
		}

		this.props.handleReferenceAdd(item, function (itemToAdd) {
			_this2.setState({
				openDialog: undefined,
				callback: undefined
			});
			_this2.state.callback(itemToAdd);
		});
	},

	render: function render() {
		var menuItems = (0, _insertMenuConfig2.default)(this.props.editor, this.openDialog);

		if (!this.state.top) {
			return null;
		}

		return _react2.default.createElement(
			'div',
			{ style: styles.container(this.state.top) },
			_react2.default.createElement(
				_core.Popover,
				{
					content: _react2.default.createElement(
						_core.Menu,
						null,
						menuItems.map(function (item, index) {
							return _react2.default.createElement(_core.MenuItem, { key: 'insert-menu-' + index, onClick: item.run, text: item.text });
						})
					),
					interactionKind: _core.PopoverInteractionKind.CLICK,
					popoverClassName: 'pt-minimal pt-popover-dismiss',
					position: _core.Position.BOTTOM_LEFT,
					inline: true,
					useSmartPositioning: false },
				_react2.default.createElement('button', { className: 'pt-button pt-minimal pt-icon-insert' })
			),
			_react2.default.createElement(_InsertMenuDialogFiles2.default, {
				isOpen: this.state.openDialog === 'files',
				onClose: this.closeDialog,
				onFileSelect: this.onFileSelect }),
			_react2.default.createElement(_InsertMenuDialogReferences2.default, {
				isOpen: this.state.openDialog === 'references',
				onClose: this.closeDialog,
				onReferenceAdd: this.onReferenceAdd })
		);
	}

});

exports.default = InsertMenu;


styles = {
	container: function container(top) {
		return {
			position: 'absolute',
			left: '-35px',
			top: top - 8
		};
	}
};