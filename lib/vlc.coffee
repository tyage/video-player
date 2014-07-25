{spawn} = require 'child_process'

vlcProcess = null

kill = () ->
  if (vlcProcess != null)
    vlcProcess.kill 'SIGKILL'
    vlcProcess = null

streaming = (input, port, errorCallback) ->
  # XXX mac os only
  vlc = '/Applications/VLC.app/Contents/MacOS/VLC'
  args = [input, '--sout', '#transcode{vcodec=theo,vb=800,scale=1,acodec=vorb,ab=128,channels=2,
    samplerate=44100}:http{mux=ogg,dst=:' + port + '}', '--sout-keep']
  vlcProcess = spawn vlc, args
  vlcProcess.on 'exit', () -> console.log 'streaming finished'
  vlcProcess.stderr.on 'data', (data) ->
    console.log data.toString()
    errorCallback data

module.exports =
  streaming: streaming
  kill: kill
