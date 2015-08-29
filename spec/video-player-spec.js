'use babel';

let remote = require('remote');
let dialog = remote.require('dialog');

describe("VideoPlayer", () => {
  let activationPromise = atom.packages.activatePackage('video-player');

  describe("when the video-player:start event is triggered", () => {
    beforeEach(() => {
      expect(atom.packages.isPackageActive('video-player')).toBe(false);

      runs(() => {
        activationPromise.fail((e) => console.log(e));
      });
    });

    it("then dialog opened", () => {
      let workspaceElement = atom.views.getView(atom.workspace);
      atom.commands.dispatch(workspaceElement, 'video-player:stop');
      waitsForPromise(() => activationPromise);

      let dialogOpened = false;
      let originalDialogOpen = dialog.showOpenDialog.bind(null);
      dialog.showOpenDialog = (...args) => {
        dialogOpened = true;
        return originalDialogOpen.call(dialog, ...args);
      };

      atom.commands.dispatch(workspaceElement, 'video-player:play-in-new-tab');

      expect(dialogOpened).toBe(true);
    });
  });
});
