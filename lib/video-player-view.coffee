{View} = require 'atom'
vlc = require './vlc'
remote = require 'remote'
dialog = remote.require 'dialog'
mime = require 'mime'

isCodecSupported = (codec) ->
  # codec support: http://www.chromium.org/audio-video
  supportedCodecs = [
    'audio/ogg', 'application/ogg', 'video/ogg',
    'video/webm', 'audio/webm',
    'audio/wav', 'audio/x-wav'
  ]
  codecSupported = supportedCodecs.find (c) -> codec == c
  codecSupported != undefined

module.exports =
class VideoPlayerView extends View
  @content: ->
    @div class: 'video-player', =>
      @video autoplay: true

  initialize: (serializeState) ->
    atom.workspaceView.command "video-player:play", => @play()
    atom.workspaceView.command "video-player:stop", => @stop()
    atom.workspaceView.command "video-player:display-front", => @displayFront()
    atom.workspaceView.command "video-player:display-back", => @displayBack()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    vlc.kill()
    @detach()

  stop: ->
    vlc.kill()
    @detach()

  play: ->
    videoView = this
    dialog.showOpenDialog title: 'Open', properties: ['openFile'], (paths) ->
      if (paths != undefined)
        vlc.kill()

        inputFile = paths[0]
        mimeType = mime.lookup inputFile

        atom.workspaceView.find('.pane.active .item-views').append(videoView)
        video = atom.workspaceView.find('.video-player video')
        if isCodecSupported mimeType
          video.attr 'src', inputFile
        else
          # when play unsupported file, try to use VLC
          streamServer = 'http://localhost:' + vlc.port
          vlc.streaming inputFile, (data) ->
            # XXX start when VLC start streaming
            video.attr 'src', streamServer

  displayFront: ->
    jQuery(this).addClass('front')

  displayBack: ->
    jQuery(this).removeClass('front')
