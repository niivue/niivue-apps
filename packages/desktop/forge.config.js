module.exports = {
  packagerConfig: {
    ignore: "(.git|.vscode|node_modules|docs|dist|.gitignore|README.md|LICENSE.md)",
    icon: "./niivue",
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
