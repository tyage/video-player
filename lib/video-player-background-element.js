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

  toggleControl() {
    this.videoPlayer.toggleControl();
    atom.config.set('video-player.showControlInBackground', this.videoPlayer.isControlVisible());
  }

  play(files) {
    this.videoPlayer.play(files);
    const showControl = atom.config.get('video-player.showControlInBackground');
    if (showControl) {
      this.videoPlayer.showControl();
    } else {
      this.videoPlayer.hideControl();
    }
  }
}

module.exports = document.registerElement('video-player-background', {
  prototype: VideoPlayerBackgroundElement.prototype
});
