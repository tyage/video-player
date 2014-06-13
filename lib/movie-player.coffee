MoviePlayerView = require './movie-player-view'

module.exports =
  moviePlayerView: null

  activate: (state) ->
    @moviePlayerView = new MoviePlayerView(state.moviePlayerViewState)

  deactivate: ->
    @moviePlayerView.destroy()

  serialize: ->
    moviePlayerViewState: @moviePlayerView.serialize()
