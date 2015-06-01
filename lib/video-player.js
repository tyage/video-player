'use babel';

let VideoPlayerElement = require('./video-player-element');

module.exports = {
  config: {
    vlcPath: {
      title: 'Path to VLC',
      description: 'The path to VLC file',
      type: 'string',
      default: '/Applications/VLC.app/Contents/MacOS/VLC'
    },
    encoding: {
      title: 'Encoding format',
      description: 'When you convert the video with VLC, this format is used',
      type: 'string',
      enum: ['ogg', 'webm'],
      default: 'ogg'
    },
    port: {
      title: 'Port of VLC streaming',
      description: 'VLC stream the video with this port',
      type: 'integer',
      default: 9530
    },
    alwaysVLC: {
      title: 'Always use VLC',
      description: 'Check this if you always use VLC as video player',
      type: 'boolean',
      default: false
    }
  },
  activate: (state) => {
    atom.commands.add('atom-workspace', {
      "video-player:play-in-background": () => VideoPlayerElement.playInBackground(),
      "video-player:play-in-new-tab": () => VideoPlayerElement.playInNewTab(),
      "video-player:stop": () => VideoPlayerElement.stop(),
      "video-player:toggle-back-forth": () => VideoPlayerElement.toggleBackForth(),
      "video-player:toggle-control": () => VideoPlayerElement.toggleControl(),
      "video-player:reload-source": () => VideoPlayerElement.reloadSrc()
    });
  },
  deactivate: () => VideoPlayerElement.destroy(),
};
