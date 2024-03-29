import path from 'path';

export default {
  // mock the vscode API which you use in your project. Jest will tell you which keys are missing.
  workspace: {
    workspaceFolders: [
      {
        uri: {
          path: path.resolve(__dirname, '..'),
        },
      },
    ],
  },
};
