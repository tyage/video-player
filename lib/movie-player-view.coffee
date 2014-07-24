{View} = require 'atom'
{spawn} = require 'child_process'
fs = require 'fs'

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

###
encode2webm = (input, output) ->
  args = ['-re', '-i', input, '-codec:v', 'libvpx', '-codec:a', 'libvorbis',
    '-b:v', '800k', '-b:a', '128k', '-movflags', 'frag_keyframe', '-f', 'webm', '-y', output]
  ffmpeg = spawn 'ffmpeg', args
  ffmpeg.on 'exit', () -> console.log 'encode ended'
  ffmpeg.stderr.on 'data', (data) -> console.log data.toString()
###

module.exports =
class MoviePlayerView extends View
  @content: ->
    @div class: 'movie-player', =>
      @video autoplay: true

  initialize: (serializeState) ->
    atom.workspaceView.command "movie-player:toggle", => @toggle()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  toggle: ->
    if @hasParent()
      @detach()
    else
      inputFile = '/Users/tyage/tmp/[20140220-0223]水曜アニメ・水もん　未確認で進行形.m2ts.mp4'
      port = 114571
      streamServer = 'http://localhost:' + port
      streaming inputFile, port, (data) ->
        # XXX start when VLC start streaming
        atom.workspaceView.find('.movie-player video').get(0).src = streamServer
      atom.workspaceView.find('.pane.active .item-views').append(this)
