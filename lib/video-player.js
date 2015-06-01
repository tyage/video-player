'use babel';

let remote = require('remote');
let dialog = remote.require('dialog');
let VideoPlayerElement = require('./video-player-element');
let VideoPlayerTabElement = require('./video-player-tab-element');

let createBackgroundVideo = () => {
  let backgroundVideo = new VideoPlayerElement();
  atom.views.getView(atom.workspace.getActivePane())
    .querySelector('.item-views')
    .appendChild(backgroundVideo);
  return backgroundVideo;
};
let backgroundVideo = createBackgroundVideo();

let selectFiles = (callback) => {
  let properties = ['openFile', 'multiSelections'];
  dialog.showOpenDialog({
    title: 'Open',
    properties: properties
  }, callback);
};

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
      "video-player:play-in-background": () => selectFiles((files) => backgroundVideo.play(files)),
      "video-player:play-in-new-tab": () => selectFiles((files) => {
        let video = new VideoPlayerTabElement();
        video.play(files);
      }),
      "video-player:stop": () => backgroundVideo.stop(),
      "video-player:toggle-back-forth": () => backgroundVideo.toggleBackForth(),
      "video-player:toggle-control": () => backgroundVideo.toggleControl(),
      "video-player:reload-source": () => backgroundVideo.reloadSrc()
    });
  },
  deactivate: () => VideoPlayerElement.destroy(),
};
