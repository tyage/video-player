'use babel';

let spawn = require('child_process').spawn;
let unorm = require('unorm');

let currentPort = null;
let getNewPort = () => {
  currentPort = currentPort === null ?
    atom.config.get('video-player.port') :
    currentPort + 1;
  return currentPort;
};

class VLC {
  constructor() {
    this.process = null;
    this.port = null;
  }

  kill() {
    if (this.process != null) {
      this.process.kill('SIGKILL');
      this.process = null;
    }
  }

  transcodeArg() {
    let transcodeOptions = {
      vb: 800,
      scale: 1,
      acodec: 'vorb',
      ab: 128,
      channels: 2,
      samplerate: 44100
    };
    let httpOptions = {
      dst: `:${this.port}`
    };

    let format = atom.config.get('video-player.encoding');
    switch (format) {
      case 'ogg':
        transcodeOptions.vcodec = 'theo';
        httpOptions.mux = 'ogg';
        break;
      case 'webm':
        transcodeOptions.vcodec = 'VP80';
        httpOptions.mux = 'ffmpeg{mux=webm}';
        break;
    }

    let transcodeOption = Object.getOwnPropertyNames(transcodeOptions)
      .map((name) => `${name}="${transcodeOptions[name]}"`);
    let httpOption = Object.getOwnPropertyNames(httpOptions)
      .map((name) => `${name}="${httpOptions[name]}"`);
    return `#transcode{${transcodeOption}}:http{${httpOption}}`;
  }

  streaming(inputs, errorCallback) {
    this.port = getNewPort();

    let vlc = atom.config.get('video-player.vlcPath');
    let files = inputs.map(unorm.nfc);
    let args = files.concat(['--sout', this.transcodeArg(), '-I', 'dummy', '--sout-keep']);
    this.process = spawn(vlc, args);
    this.process.on('exit', () => console.log('streaming finished'));
    this.process.stderr.on('data', (data) => {
      console.log(data.toString());
      errorCallback(data);
    });
  }
}

module.exports = VLC;
