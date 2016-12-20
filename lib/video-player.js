'use babel';

let { dialog } = require('electron').remote;
let VideoPlayerElement = require('./video-player-element');
let VideoPlayerBackgroundElement = require('./video-player-background-element');
let VideoPlayerTabElement = require('./video-player-tab-element');

let videoPlayers = [];

let backgroundVideo = new VideoPlayerBackgroundElement();
videoPlayers.push(backgroundVideo.videoPlayer);

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
      description: 'VLC stream the video with this port and above',
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
      // for new tab
      "video-player:play-in-new-tab": () => selectFiles((files) => {
        if (!Array.isArray(files)) {
          return;
        }

        let tab = new VideoPlayerTabElement();
        tab.openInNewTab(files.join(','));

        videoPlayers.push(tab.videoPlayer);

        tab.videoPlayer.play(files);
      }),

      // for background
      "video-player:play-in-background": () => selectFiles((files) => {
        backgroundVideo.videoPlayer.play(files);
      }),
      "video-player:stop": () => backgroundVideo.videoPlayer.stop(),
      "video-player:toggle-back-forth": () => backgroundVideo.toggleBackForth(),
      "video-player:toggle-control": () => backgroundVideo.videoPlayer.toggleControl(),
      "video-player:reload-source": () => backgroundVideo.videoPlayer.reloadSrc(),
      "video-player:resume": () => backgroundVideo.videoPlayer.resumeHtml5(),
      "video-player:pause": () => backgroundVideo.videoPlayer.pauseHtml5()
    });
  },
  deactivate: () => videoPlayers.forEach((videoPlayer) => videoPlayer.stop()),
};
