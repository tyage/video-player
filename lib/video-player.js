'use babel';

let VideoPlayerView = require('./video-player-view');

module.exports = {
  configDefaults: {
    vlcPath: '/Applications/VLC.app/Contents/MacOS/VLC'
  },
  videoPlayerView: null,
  activate: (state) => {
    this.videoPlayerView = new VideoPlayerView(state.videoPlayerViewState);
  },
  deactivate: () => this.videoPlayerView.destroy(),
  serialize: () => {
    return { videoPlayerViewState: this.videoPlayerView.serialize() };
  }
};
