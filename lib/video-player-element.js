'use babel';

let VLC = require('./vlc');

class VideoPlayerElement extends HTMLElement {
  createdCallback() {
    this.vlc = new VLC();

    this.shadowRoot = this.createShadowRoot();

    this.initializeContent();
  }

  initializeContent() {
    this.videoElement = document.createElement('video');
    this.videoElement.setAttribute('autoplay', true);
    this.shadowRoot.appendChild(this.videoElement);
  }

  detachedCallback() {
    this.vlc.kill();
  }

  stop() {
    this.vlc.kill();
    this.videoElement.remove();
  }

  play(files) {
    if (!Array.isArray(files)) {
      return;
    }

    this.vlc.kill();

    this.videoElement.remove();
    this.initializeContent();

    let alwaysVLC = atom.config.get('video-player.alwaysVLC');
    if (alwaysVLC) {
      this._playWithVLC(files);
    } else {
      this._playWithHtml5Video(files);
    }
  }

  _playWithVLC(files) {
    let video = this.videoElement;
    this.vlc.streaming(files, () => this.reloadSrc());
    video.addEventListener('ended', () => this.reloadSrc());
    video.addEventListener('suspend', () => this.reloadSrc());

    let streamServer = `http://localhost:${this.vlc.port}`;
    video.setAttribute('src', streamServer);
  }

  _playWithHtml5Video(files) {
    let video = this.videoElement;
    let fallbackToVLC = () => {
      video.removeEventListener('error', fallbackToVLC);

      // If any error occured, try to play with VLC
      files.unshift(video.getAttribute('src'));
      this._playWithVLC(files);
    };
    video.setAttribute('src', files.shift());
    video.addEventListener('ended', () => {
      let file = files.shift();
      if(file) {
        video.setAttribute('src', file);
      }
    });
    video.addEventListener('error', fallbackToVLC);
  }

  reloadSrc() {
    let src = this.videoElement.getAttribute('src');
    this.videoElement.setAttribute('src', src);
  }

  toggleControl() {
    let controls = this.videoElement.getAttribute('controls');
    this.videoElement.setAttribute('controls', !controls);
  }

  pauseHtml5() {
    this.videoElement.pause();
  }

  resumeHtml5() {
    this.videoElement.play();
  }
};

module.exports = document.registerElement('video-player', {
  prototype: VideoPlayerElement.prototype
});
