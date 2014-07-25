{View} = require 'atom'
vlc = require './vlc'

module.exports =
class VideoPlayerView extends View
  @content: ->
    @div class: 'video-player', =>
      @video autoplay: true

  initialize: (serializeState) ->
    atom.workspaceView.command "video-player:toggle", => @toggle()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    vlc.kill()
    @detach()

  toggle: ->
    if @hasParent()
      vlc.kill()
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
      video = atom.workspaceView.find('.video-player video')
      if codecSupported
        video.attr 'src', inputFile
      else
        # when play unsupported file, try to use VLC
        port = 9530
        streamServer = 'http://localhost:' + port
        vlc.streaming inputFile, port, (data) ->
          # XXX start when VLC start streaming
          video.attr 'src', streamServer
