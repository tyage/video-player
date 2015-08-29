'use babel';

let VideoPlayerElement = require('./video-player-element');

class VideoPlayerTabElement extends HTMLElement {
  createdCallback() {
    this.videoPlayer = new VideoPlayerElement();
    this.shadowRoot = this.createShadowRoot();
    this.shadowRoot.appendChild(this.videoPlayer);
  }

  openInNewTab(title) {
    this.title = title;
    let pane = atom.workspace.getActivePane();
    let item = pane.addItem(this);
    pane.activateItem(item);
  }

  getTitle() {
    return this.title || 'Video player';
  }
}

module.exports = document.registerElement('video-player-tab', {
  prototype: VideoPlayerTabElement.prototype
});
