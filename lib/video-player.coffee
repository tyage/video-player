VideoPlayerView = require './video-player-view'

module.exports =
  videoPlayerView: null

  activate: (state) ->
    @videoPlayerView = new VideoPlayerView(state.videoPlayerViewState)

  deactivate: ->
    @videoPlayerView.destroy()

  serialize: ->
    videoPlayerViewState: @videoPlayerView.serialize()
