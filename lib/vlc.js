'use babel';

let spawn = require('child_process').spawn;
let unorm = require('unorm');

let port = 9530;
let vlcProcess = null;

let kill = () => {
  if (vlcProcess != null) {
    vlcProcess.kill('SIGKILL');
    vlcProcess = null;
  }
};

let streaming = (inputs, errorCallback) => {
  let vlc = atom.config.get('video-player.vlcPath');
  let files = inputs.map(unorm.nfc);
  let args = files.concat(['--sout',
    `#transcode{vcodec=theo,vb=800,scale=1,acodec=vorb,ab=128,channels=2,
    samplerate=44100}:http{mux=ogg,dst=:${port}}`,
    '-I dummy',
    '--sout-keep']);
  vlcProcess = spawn(vlc, args);
  vlcProcess.on('exit', () => console.log('streaming finished'));
  vlcProcess.stderr.on('data', (data) => {
    console.log(data.toString());
    errorCallback(data);
  });
};

module.exports = {
  streaming: streaming,
  kill: kill,
  port: port
};
