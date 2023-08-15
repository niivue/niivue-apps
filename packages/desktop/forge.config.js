const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');

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
  hooks: {
    postMake: async (forgeConfig, options) => {
        const srcNodeModules = path.join(__dirname, '../../node_modules');
        console.log(srcNodeModules);
        const output =  path.join(__dirname, `out/nv-${process.platform}-${process.arch}/resources/app`)
        const destNodeModules =  path.join(output, 'node_modules')
        fs.cpSync( srcNodeModules, destNodeModules, {recursive: true});
        exec(`npm --prefix ${output} prune --production`)
    }
}
};
