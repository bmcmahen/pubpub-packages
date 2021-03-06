import { PluginKey } from 'prosemirror-state';

const keys = {
  citations: new PluginKey('citations'),
  relativefiles: new PluginKey('relativefiles'),
  mentions: new PluginKey('mentions'),
};

exports.keys = keys;

exports.getPluginState = (key, state) => {
  return keys[key].getState(state);
};

exports.getPlugin = (key, state) => {
  return keys[key].get(state);
};
