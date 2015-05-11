'use babel';

let WorkspaceView = require('atom').WorkspaceView;
let VideoPlayer = require('../lib/video-player');
let remote = require('remote');
let dialog = remote.require('dialog');

describe("VideoPlayer", () => {
  let activationPromise = null;

  beforeEach(() => {
    atom.workspaceView = new WorkspaceView();
    activationPromise = atom.packages.activatePackage('video-player');
  });

  describe("when the video-player:start event is triggered", () => {
    it("then dialog opened", () => {
      let dialogOpened = false;
      let originalDialogOpen = dialog.showOpenDialog.bind(null);
      dialog.showOpenDialog = (...args) => {
        dialogOpened = true;
        return originalDialogOpen.call(dialog, ...args);
      };

      atom.workspaceView.trigger('video-player:play');

      waitsForPromise(() => activationPromise);

      runs(() => expect(dialogOpened).toBe(true));
    });
  });
});
