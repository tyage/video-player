'use babel';

let VideoPlayerElement = require('./video-player-element');

module.exports = {
  config: {
    vlcPath: {
      title: 'path to VLC',
      description: 'set the path to VLC',
      type: 'string',
      default: '/Applications/VLC.app/Contents/MacOS/VLC'
    }
  },
  activate: (state) => {
    atom.commands.add('atom-workspace', {
      "video-player:play": () => VideoPlayerElement.play(),
      "video-player:stop": () => VideoPlayerElement.stop(),
      "video-player:toggle-back-forth": () => VideoPlayerElement.toggleBackForth(),
      "video-player:toggle-control": () => VideoPlayerElement.toggleControl(),
      "video-player:reload-source": () => VideoPlayerElement.reloadSrc()
    });
  },
  deactivate: () => VideoPlayerElement.destroy(),
};
