'use babel';

let VideoPlayerElement = require('./video-player-element');

module.exports = {
  config: {
    vlcPath: {
      title: 'Path to VLC',
      description: 'Set the path to VLC',
      type: 'string',
      default: '/Applications/VLC.app/Contents/MacOS/VLC'
    },
    encoding: {
      title: 'Encoding format',
      description: 'When you convert the video with VLC, this format is used',
      type: 'string',
      enum: ['ogg', 'webm'],
      default: 'ogg'
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
