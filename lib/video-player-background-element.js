'use babel';

let VideoPlayerElement = require('./video-player-element');

class VideoPlayerBackgroundElement extends HTMLElement {
  createdCallback() {
    atom.views.getView(atom.workspace.getActivePane())
      .querySelector('.item-views')
      .appendChild(this);

    this.videoPlayer = new VideoPlayerElement();
    this.shadowRoot = this.createShadowRoot();
    this.shadowRoot.appendChild(this.videoPlayer);
  }

  toggleBackForth() {
    this.classList.toggle('front');
  }
}

module.exports = document.registerElement('video-player-background', {
  prototype: VideoPlayerBackgroundElement.prototype
});
