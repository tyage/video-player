'use babel';

let vlc = require('./vlc');
let remote = require('remote');
let dialog = remote.require('dialog');

class VideoPlayerElement extends HTMLElement {
  createdCallback() {
    this.shadowRoot = this.createShadowRoot();

    this.initializeContent();
  }

  initializeContent() {
    this.videoElement = document.createElement('video');
    this.videoElement.setAttribute('autoplay', true);
    this.shadowRoot.appendChild(this.videoElement);
  }

  // Tear down any state and detach
  destroy() {
    vlc.kill();
    this.videoElement.remove();
  }

  stop() {
    vlc.kill();
    this.videoElement.remove();
  }

  play() {
    let properties = ['openFile', 'multiSelections'];
    dialog.showOpenDialog({
      title: 'Open',
      properties: properties
    }, (files) => {
      if(files != undefined) {
        this._play(files);
      }
    });
  }

  _play(files) {
    vlc.kill();

    this.videoElement.remove();
    this.initializeContent();

    this._playWithHtml5Video(files);
  }

  _playWithVlc(files) {
    let video = this.videoElement;
    let port = atom.config.get('video-player.port');
    let streamServer = `http://localhost:${port}`;
    video.setAttribute('src', streamServer);
    vlc.streaming(files, () => this.reloadSrc());
    video.addEventListener('ended', () => this.reloadSrc());
    video.addEventListener('suspend', () => this.reloadSrc());
  }

  _playWithHtml5Video(files) {
    let video = this.videoElement;
    let fallbackToVLC = () => {
      video.removeEventListener('error', fallbackToVLC);

      // If any error occured, try to play with VLC
      files.unshift(video.getAttribute('src'));
      this._playWithVlc(files);
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

  toggleBackForth() {
    this.classList.toggle('front');
  }

  toggleControl() {
    let controls = this.videoElement.getAttribute('controls');
    this.videoElement.setAttribute('controls', !controls);
  }
};

let videoPlayerElement = document.registerElement('video-player', {
  prototype: VideoPlayerElement.prototype
});
let element = new videoPlayerElement();

atom.views.getView(atom.workspace)
  .querySelector('.pane.active .item-views')
  .appendChild(element);

module.exports = element;
