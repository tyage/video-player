'use babel';

let VideoPlayerElement = require('./video-player-element');

class VideoPlayerTabElement extends HTMLElement {
  createdCallback() {
    let pane = atom.workspace.getActivePane();
    let item = pane.addItem(this);
    pane.activateItem(item);

    this.videoPlayer = new VideoPlayerElement();
    this.shadowRoot = this.createShadowRoot();
    this.shadowRoot.appendChild(this.videoPlayer);
  }

  getTitle() {
    return 'video';
  }
}

module.exports = document.registerElement('video-player-tab', {
  prototype: VideoPlayerTabElement.prototype
});
