module.exports = {
  packagerConfig: {
    ignore: "(.git|.vscode|node_modules|docs|dist|.gitignore|README.md|LICENSE.md)",
    icon: "./niivue",
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'niivue',
          name: 'niivue-apps'
        },
        prerelease: true
      }
    }
  ]
};
