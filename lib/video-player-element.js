'use babel';

let vlc = require('./vlc');
let remote = require('remote');
let dialog = remote.require('dialog');
let mime = require('mime');

let isCodecSupported = (codec) => {
  // codec support: http://www.chromium.org/audio-video
  let supportedCodecs = [
    'audio/ogg', 'application/ogg', 'video/ogg',
    'video/webm', 'audio/webm',
    'audio/wav', 'audio/x-wav'
  ];
  let codecSupported = supportedCodecs.filter((c) => codec == c);
  return codecSupported.length > 0;
};

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

    let codecUnsupported = files.filter((file) => {
      let mimeType = mime.lookup(file);
      !isCodecSupported(mimeType);
    });
    if(codecUnsupported.length > 0) {
      // when play unsupported file, try to use VLC
      this._playWithVlc(files);
    } else {
      this._playWithHtml5Video(files);
    }
  }

  _playWithVlc(files) {
    let streamServer = 'http://localhost:' + vlc.port;
    this.videoElement.setAttribute('src', streamServer);
    vlc.streaming(files, () => this.reloadSrc());
    this.videoElement.addEventListener('ended', () => this.reloadSrc());
    this.videoElement.addEventListener('suspend', () => this.reloadSrc());
  }

  _playWithHtml5Video(files) {
    let counter = 0;
    this.videoElement.setAttribute('src', files[counter]);
    this.videoElement.addEventListener('ended', () => {
      ++counter;
      if(counter < files.length) {
        this.videoElement.setAttribute('src', files[counter]);
      }
    });
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
