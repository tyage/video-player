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
    atom.workspaceView.command "video-player:toggle-back-forth", => @toggleBackForth()
    atom.workspaceView.command "video-player:toggle-control", => @toggleControl()
    atom.workspaceView.command "video-player:reload-source", => @reloadSrc()

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
    self = this
    properties = ['openFile', 'multiSelections']
    dialog.showOpenDialog title: 'Open', properties: properties, (files) ->
      if files != undefined
        self._play files

  _play: (files) ->
    vlc.kill()

    itemViews = atom.workspaceView.find('.pane.active .item-views')
    itemViews.find('.video-player').remove()
    itemViews.append this
    video = atom.workspaceView.find '.video-player video'

    codecUnsupported = files.find (file) ->
      mimeType = mime.lookup file
      !isCodecSupported mimeType
    if codecUnsupported
      # when play unsupported file, try to use VLC
      this._playWithVlc video, files
    else
      this._playWithHtml5Video video, files

  _playWithVlc: (video, files) ->
    self = this
    streamServer = 'http://localhost:' + vlc.port
    video.attr 'src', streamServer
    vlc.streaming files, (data) -> self._reloadSrc video
    video.on 'ended', () -> self._reloadSrc video
    video.on 'suspend', () -> self._reloadSrc video

  _playWithHtml5Video: (video, files) ->
    counter = 0
    video.attr 'src', files[counter]
    video.on 'ended', () ->
      ++counter
      if (counter < files.length)
        video.attr 'src', files[counter]

  _reloadSrc: (video) ->
    src = video.attr 'src'
    video.attr 'src', src

  reloadSrc: ->
    video = atom.workspaceView.find '.video-player video'
    this._reloadSrc video

  toggleBackForth: ->
    jQuery(this).toggleClass 'front'

  toggleControl: ->
    video = jQuery(this).find 'video'
    controls = video.attr 'controls'
    video.attr 'controls', !controls
