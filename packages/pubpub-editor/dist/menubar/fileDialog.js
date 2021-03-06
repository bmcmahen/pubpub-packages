'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.FileDialog = undefined;

var _core = require('@blueprintjs/core');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fileUpload = require('./fileUpload');

var _fileUpload2 = _interopRequireDefault(_fileUpload);

var _renderFiles = require('@pubpub/render-files');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {};

var FileDialog = exports.FileDialog = _react2.default.createClass({
	displayName: 'FileDialog',

	propTypes: {
		fileAccept: _react.PropTypes.string,
		saveFile: _react.PropTypes.func,
		onClose: _react.PropTypes.func,
		open: _react.PropTypes.bool
	},
	getInitialState: function getInitialState() {
		return { editing: true };
	},

	setSelected: function setSelected(selected) {
		this.setState({ selected: selected });
	},

	uploadFile: function uploadFile(_ref) {
		var url = _ref.url,
		    filename = _ref.filename,
		    preview = _ref.preview,
		    type = _ref.type;

		this.setState({ url: url, filename: filename, preview: preview, type: type });
	},

	saveFile: function saveFile() {
		var _state = this.state,
		    url = _state.url,
		    filename = _state.filename,
		    type = _state.type;

		this.props.saveFile({ url: url, filename: filename, type: type });
	},

	onClose: function onClose() {
		this.props.onClose();
	},

	preventClick: function preventClick(evt) {
		evt.preventDefault();
	},

	editFileName: function editFileName(evt) {
		this.setState({ filename: evt.target.value });
	},

	insertFile: function insertFile(_ref2) {
		var url = _ref2.url,
		    filename = _ref2.filename;

		this.props.insertFile({ url: url, filename: filename });
	},

	renderDisplay: function renderDisplay() {
		var _props = this.props,
		    open = _props.open,
		    fileAccept = _props.fileAccept,
		    files = _props.files,
		    type = _props.type;
		var _state2 = this.state,
		    url = _state2.url,
		    filename = _state2.filename;


		var title = void 0;
		if (type === 'video') {
			title = "Insert Video";
		} else if (type === 'image') {
			title = "Insert Image";
		} else {
			title = "Insert File";
		}

		return _react2.default.createElement(
			'div',
			{ onClick: this.preventClick },
			_react2.default.createElement(
				_core.Dialog,
				{
					iconName: 'inbox',
					isOpen: open,
					onClose: this.onClose,
					title: title
				},
				_react2.default.createElement(
					'div',
					{ className: 'pt-dialog-body' },
					!this.state.url || !this.state.preview ? _react2.default.createElement(_fileUpload2.default, { type: type, files: files, fileAccept: fileAccept, uploadFile: this.uploadFile, insertFile: this.insertFile }) : _react2.default.createElement(
						'div',
						{ style: { display: 'block', margin: '0 auto', textAlign: 'center', maxWidth: '300px' } },
						_react2.default.createElement(_renderFiles.RenderFile, { file: { url: this.state.url, type: this.state.type } }),
						_react2.default.createElement(
							'label',
							{ className: 'pt-label' },
							_react2.default.createElement('input', { value: filename, onChange: this.editFileName, className: 'pt-input', type: 'text', placeholder: 'Text input', dir: 'auto' })
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'pt-dialog-footer' },
					type === 'video' ? _react2.default.createElement(
						'div',
						{ className: 'pt-callout', style: { marginBottom: 10 } },
						'Video files can be large! Be ready for a longer upload process. If possible, try and compress and shorten your video.'
					) : null,
					_react2.default.createElement(
						'div',
						{ className: 'pt-dialog-footer-actions' },
						_react2.default.createElement(_core.Button, { intent: 'yes', disabled: !this.state.url, onClick: this.saveFile, text: 'Upload' })
					)
				)
			)
		);
	},


	render: function render() {
		var editing = this.state.editing;

		return this.renderDisplay();
	}
});

exports.default = FileDialog;