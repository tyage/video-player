'use babel';

let WorkspaceView = require('atom').WorkspaceView;
let VideoPlayer = require('../lib/video-player');
let remote = require('remote');
let dialog = remote.require('dialog');

describe("VideoPlayer", () => {
  let activationPromise;

  beforeEach(() => {
    expect(atom.packages.isPackageActive('video-player')).toBe(false);

    atom.project.setPaths([path.join(__dirname, 'sample')]);

    let workspaceElement = atom.views.getView(atom.workspace)

    waitsForPromise(() => atom.workspace.open('README.md'));

    runs(() => {
      jasmine.attachToDOM(workspaceElement)
      editor = atom.workspace.getActiveTextEditor()
      editorView = atom.views.getView(editor)

      activationPromise = atom.packages.activatePackage('video-player');
      activationPromise.fail((e) => console.log(e));
    });
  });

  describe("when the video-player:start event is triggered", () => {
    it("then dialog opened", () => {
      atom.commands.dispatch(editorView, 'video-player:stop');
      waitsForPromise(() => atom.packages.activatePackage('video-player'));

      let dialogOpened = false;
      let originalDialogOpen = dialog.showOpenDialog.bind(null);
      dialog.showOpenDialog = (...args) => {
        dialogOpened = true;
        return originalDialogOpen.call(dialog, ...args);
      };

      atom.commands.dispatch(editorView, 'video-player:play');

      expect(dialogOpened).toBe(true);
    });
  });
});
