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
      # XXX choose from input[type="file"]
      inputFile = '/Users/tyage/tmp/[20140220-0223]水曜アニメ・水もん　未確認で進行形.m2ts.mp4'
      fileType = ''

      # codec support: http://www.chromium.org/audio-video
      supportedCodecs = [
        'audio/ogg', 'application/ogg', 'video/ogg',
        'video/webm', 'audio/webm',
        'audio/wav', 'audio/x-wav'
      ]
      codecSupported = supportedCodecs.find (codec) -> codec == fileType

      atom.workspaceView.find('.pane.active .item-views').append(this)
      video = atom.workspaceView.find('.movie-player video')
      if codecSupported
        video.attr 'src', inputFile
      else
        # when play unsupported file, try to use VLC
        port = 9530
        streamServer = 'http://localhost:' + port
        streaming inputFile, port, (data) ->
          # XXX start when VLC start streaming
          video.attr 'src', streamServer
