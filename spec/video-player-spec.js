'use babel';

const { dialog } = require('electron').remote

describe("VideoPlayer", () => {
  const activationPromise = atom.packages.activatePackage('video-player');

  describe("when the video-player:start event is triggered", () => {
    beforeEach(() => {
      expect(atom.packages.isPackageActive('video-player')).toBe(false);

      runs(() => {
        activationPromise.catch((e) => console.log(e));
      });
    });

    it("then dialog opened", () => {
      const workspaceElement = atom.views.getView(atom.workspace);
      atom.commands.dispatch(workspaceElement, 'video-player:stop');
      waitsForPromise(() => activationPromise);

      let dialogOpened = false;
      const originalDialogOpen = dialog.showOpenDialog.bind(null);
      dialog.showOpenDialog = (...args) => {
        dialogOpened = true;
        return originalDialogOpen.call(dialog, ...args);
      };

      atom.commands.dispatch(workspaceElement, 'video-player:play-in-new-tab');

      expect(dialogOpened).toBe(true);
    });
  });
});
