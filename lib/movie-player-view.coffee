{View} = require 'atom'

module.exports =
class MoviePlayerView extends View
  @content: ->
    @div class: 'movie-player overlay from-top', =>
      @div "The MoviePlayer package is Alive! It's ALIVE!", class: "message"

  initialize: (serializeState) ->
    atom.workspaceView.command "movie-player:toggle", => @toggle()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  toggle: ->
    console.log "MoviePlayerView was toggled!"
    if @hasParent()
      @detach()
    else
      atom.workspaceView.append(this)
