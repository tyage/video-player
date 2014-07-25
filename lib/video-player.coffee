VideoPlayerView = require './video-player-view'

module.exports =
  configDefaults:
    vlcPath: '/Applications/VLC.app/Contents/MacOS/VLC'

  videoPlayerView: null

  activate: (state) ->
    @videoPlayerView = new VideoPlayerView(state.videoPlayerViewState)

  deactivate: ->
    @videoPlayerView.destroy()

  serialize: ->
    videoPlayerViewState: @videoPlayerView.serialize()
