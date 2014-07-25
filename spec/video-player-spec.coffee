{WorkspaceView} = require 'atom'
VideoPlayer = require '../lib/video-player'
remote = require 'remote'
dialog = remote.require 'dialog'

describe "VideoPlayer", ->
  activationPromise = null

  beforeEach ->
    atom.workspaceView = new WorkspaceView
    activationPromise = atom.packages.activatePackage('video-player')

  describe "when the video-player:start event is triggered", ->
    it "then dialog opened", ->
      dialogOpened = false
      originalDialogOpen = dialog.showOpenDialog
      dialog.showOpenDialog = () ->
        dialogOpened = true
        originalDialogOpen.apply(this, arguments)

      atom.workspaceView.trigger 'video-player:play'

      waitsForPromise ->
        activationPromise

      runs ->
        expect(dialogOpened).toBe true
