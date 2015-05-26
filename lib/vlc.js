'use babel';

let spawn = require('child_process').spawn;
let unorm = require('unorm');

let vlcProcess = null;

let kill = () => {
  if (vlcProcess != null) {
    vlcProcess.kill('SIGKILL');
    vlcProcess = null;
  }
};

let transcodeArg = () => {
  let port = atom.config.get('video-player.port');
  let transcodeOptions = {
    vb: 800,
    scale: 1,
    acodec: 'vorb',
    ab: 128,
    channels: 2,
    samplerate: 44100
  };
  let httpOptions = {
    dst: `:${port}`
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
};

let streaming = (inputs, errorCallback) => {
  let vlc = atom.config.get('video-player.vlcPath');
  let files = inputs.map(unorm.nfc);
  let args = files.concat(['--sout', transcodeArg(), '-I', 'dummy', '--sout-keep']);
  vlcProcess = spawn(vlc, args);
  vlcProcess.on('exit', () => console.log('streaming finished'));
  vlcProcess.stderr.on('data', (data) => {
    console.log(data.toString());
    errorCallback(data);
  });
};

module.exports = {
  streaming: streaming,
  kill: kill
};
