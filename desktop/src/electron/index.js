const { app, BrowserWindow, Menu, MenuItem, ipcMain} = require('electron');
const path = require('path');
const { fork } = require("child_process");
const {devPorts} = require('./devPorts');
const {events} = require('./events');
const parseArgs = require('minimist');
const args = parseArgs(process.argv.slice(2),
  {
    boolean: ['dev']
  }
);

/**
 * the filters for the volume file dialog
 * @type {Array<Object>}
 * @property {string} name - The name of the filter.
 * @property {Array<string>} extensions - The extensions for the filter.
 */
const nvVolumeFilters = [
  { name: 'Volume types', extensions: [
    'nii',
    'nii.gz',
    'mih',
    'mif',
    'nrrd',
    'nhdr',
    'mhd',
    'mha',
    'mgh',
    'mgz',
    'v',
    'v16',
    'vmr',
    'HEAD', // afni HEAD/BRIK
    ] 
  }
];

/**
 * The filters for the surface file dialog.
 * @type {Array<Object>}
 * @property {string} name - The name of the filter.
 * @property {Array<string>} extensions - The extensions for the filter.
 */
const nvSurfaceFilters = [
  { name: 'Surface types', extensions: [
    'gz',
    'jcon',
    'json',
    'tck',
    'trk',
    'trx',
    'tract',
    'gii',
    'mz3',  
    'asc',
    'dfs',
    'byu',
    'geo',
    'ico',
    'off',
    'nv',
    'obj',
    'ply',
    'x3d',
    'fib',
    'vtk',
    'srf',
    'stl'
    ]
  }
];

/**
 * the main window object
 * @type {Electron.BrowserWindow}
 */
let mainWindow = {};

/**
 * the fileServer object (a forked process)
 * @type {ChildProcess}
 * @see https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options
 */
// launch the fileServer as a background process
fileServer = fork(
  path.join(__dirname, "fileServer.js"),
  { env: { FORK: true } }
);

/**
 * handles setting the process env variables for the fileServer port and host
 * @param {number} port - the port the fileServer is listening on
 * @returns {undefined}
 * @function
 */
function onFileServerPort(port) {
  process.env.NIIVUE_FILESERVER_PORT = port;
  process.env.NIIVUE_HOST = 'localhost';
}

// handler function for the fileServer port message
/**
 * Handles messages from the fileServer.
 * @param {Object} message - The message object.
 * @param {string} message.type - The type of message.
 * @param {string} message.value - The value of the message.
 * @returns {undefined}
 * @function
 */
function handleFileServerMessage(message) {
  // msg is expected to be a JSON object (automatically serialized and deserialized by process.send and 'message')
  // a message object has a 'type' and a 'value' as properties
  if (message.type === "fileServerPort") {
    onFileServerPort(message.value);
  }
}

// register the handler function for fileServer messages
fileServer.on("message", (message) => {
  handleFileServerMessage(message);
});


/**
 * Determines if the application is running in development mode.
 * @returns {boolean} True if the application is running in development mode, false otherwise.
 */
function isDev() {
  // process is an array of the command line arguments
  // the first two are the path to the node executable and the path to the script being run
  // the third is the first argument passed to the app
  // if it's "--dev", we're in development mode
  return args['dev']; //process.argv[2] === '--dev';
}

/**
 * Registers IPC listeners for the events object.
 * @returns {undefined}
 * @function
 * @see https://www.electronjs.org/docs/api/ipc-main
 */
function registerIpcListeners() {
  for (const [key, value] of Object.entries(events)) {
    /**
     * The handler function for the event.
     * @param {Electron.IpcMainInvokeEvent} event - The event object.
     * @param {object} obj - The object containing the event arguments.
     * @returns {Promise<any>} A promise that resolves to the result of the event handler.
     * @async
     * @function
     */
    async function handler(event, obj) {
      const result = await value(obj);
      return result;
    }
    ipcMain.handle(key, handler);
  }
}

/**
 * Launches an external GUI process.
 * @param {string} guiName - The name of the GUI to launch.
 */
function launchExternalGui(guiName) {
  const externalGuis = [
    'fsleyes'
  ];

  if (externalGuis.includes(guiName)) {
    const { spawn } = require('child_process');
    const child = spawn(guiName, [], {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    return true;
  } else {
    return false;
  }
}

/**
 * Creates a new browser window for the specified GUI.
 * @param {string} guiName - The name of the GUI to create a window for.
 */
function createWindow(guiName="niivue") {

  if (launchExternalGui(guiName)) {
    return;
  } 
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev()) {
    try {
      mainWindow.loadURL(`http://localhost:${devPorts[guiName]}`);
    } catch (err) {
      console.log(`Error loading ${guiName} at http://localhost:${devPorts[guiName]}`);
      console.log(err);
    }
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    // load the index.html of the app
    mainWindow.loadFile(path.join(__dirname, 'ui', 'index.html'));
  }
};

async function loadCliVolumes() {
  let cliImages = args._;
  if (cliImages.length > 0) {
    // wait for the main window to finish loading before sending the loadVolumes message
    // or else the message will be lost
    mainWindow.webContents.on('did-finish-load', async () => {
      // if passing in cliImages to openFileDialog, we don't actually show the 
      // dialog, we just return the cliImages with the same object formatting as the dialog
      let result = await events.openFileDialog(filters=nvVolumeFilters, cliImages=cliImages);
      mainWindow.webContents.send('loadVolumes', result.filePaths);
    })
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async ()=>{
  // register event handlers
  registerIpcListeners();
  // create the main window
  createWindow();
  // load cli volumes
  loadCliVolumes();
  
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // close the file server gracefully
  fileServer.kill()
  app.quit();
});


/**
 * Updates the images menu with the specified files.
 * @param {string[]} files - The files to add to the images menu.
 * @function
 * @returns {undefined}
 * @example
 * updateImagesMenu(['file1.nii.gz', 'file2.nii.gz']);
 * // adds file1.nii.gz and file2.nii.gz to the images menu
 */
function updateImagesMenu(files) {
  let appMenu = Menu.getApplicationMenu();
  let imagesMenu = appMenu.getMenuItemById('images');
  imagesMenu.submenu = [];
  imagesMenu.submenu.clear();
  for (let i = 0; i < files.length; i++) {
    imagesMenu.submenu.append(new MenuItem({
      label: files[i],
      id: `image-${i}`,
      click: () => {
        console.log(`setActiveImage ${i}`)
        //mainWindow.webContents.send('setActiveImage', i);
      },
    }));
  }

  Menu.setApplicationMenu(appMenu)
}

function appendImageToMenu(file) {
  let appMenu = Menu.getApplicationMenu();
  let imagesMenu = appMenu.getMenuItemById('images');
  imagesMenu.submenu.append(new MenuItem({
    label: file,
    id: `image-${imagesMenu.submenu.items.length}`,
    click: () => {
      console.log(`setActiveImage ${imagesMenu.submenu.items.length}`)
    },
  }));
  Menu.setApplicationMenu(appMenu)
}

/**
 * Gets the list of images in the images menu.
 * @returns {string[]} The list of images in the images menu.
 * @function
 */
function getImageMenuList() {
  let appMenu = Menu.getApplicationMenu();
  let imagesMenu = appMenu.getMenuItemById('images');
  // get just the labels as an array
  let menuItems = imagesMenu.submenu.items.map((item) => {
    return item.id === 'noImages' ? null : item.label;
  });
  // remove nulls
  menuItems = menuItems.filter((item) => {
    return item !== null;
  });
  return menuItems;
}

/**
 * Handles the load volumes menu click event.
 * @returns {string[]} The files selected by the user.
 * @async
 * @function
 * @example
 * onLoadVolumesClick();
 * // opens a file dialog and returns the selected files
 * // also sends a loadVolumes message to the main window
 * // and updates the images menu
 * // if the user selects file1.nii.gz and file2.nii.gz
 * // the function returns ['file1.nii.gz', 'file2.nii.gz']
 * // and the images menu is updated with file1.nii.gz and file2.nii.gz
 * // and the main window receives a loadVolumes message with ['file1.nii.gz', 'file2.nii.gz']
 */
async function onLoadVolumesClick() {
  let files = await events.openFileDialog(filters=nvVolumeFilters);
  mainWindow.webContents.send('loadVolumes', files.filePaths);
  // updateImagesMenu(files.filePaths);
}

/**
 * Handles the load surfaces menu click event.
 * @async
 * @function
 */
async function onLoadSurfacesClick() {
  let files = await events.openFileDialog(filters=nvSurfaceFilters);
  mainWindow.webContents.send('loadSurfaces', files.filePaths);
  updateImagesMenu(files.filePaths);
}

/**
 * Handles the add volume overlay menu click event.
 * @async
 * @function
 */
async function onAddVolumeOverlayClick() {
  let files = await events.openFileDialog(filters=nvVolumeFilters);
  // send just the first file to the main window, since we only want to add one overlay at a time
  mainWindow.webContents.send('addVolumeOverlay', files.filePaths[0]);
  //let currentImages = getImageMenuList();
  // prepend the new files to the current images
  // updateImagesMenu(files.filePaths.concat(currentImages));
  appendImageToMenu(files.filePaths[0]);
}

async function openStandard(fileName) {
  let file = path.join(__dirname, 'standard', fileName);
  // get the absolute path to the file
  file = path.resolve(file);
  mainWindow.webContents.send('loadVolumes', [file]);
  updateImagesMenu([file]);
}

/**
 * Sets the canvas view to the specified view.
 * @param {string} view - The view to set the canvas to.
 * @async
 * @function
 */
async function onSetViewClick(view) {
  mainWindow.webContents.send('setView', view);
}

async function onCloseAllVolumesClick() {
  mainWindow.webContents.send('closeAllVolumes');
}

// create an application menu
let menu = [
  // add file menu with load volumes option
  {
    label: 'File',
    submenu: [
      // load volumes
      {
        label: 'Load volumes',
        id: 'loadVolumes',
        click: async () => {
          await onLoadVolumesClick();
        }
      },
      // close all volumes
      {
        label: 'Close all volumes',
        id: 'closeAllVolumes',
        click: async () => {
          await onCloseAllVolumesClick();
        }
      },
      // load surfaces
      // {
      //   label: 'Load surfaces',
      //   id: 'loadSurfaces',
      //   click: async () => {
      //     await onLoadSurfacesClick();
      //   }
      // },
      // separator
      { type: 'separator' },
      // add volume overlay
      // {
      //   label: 'Add volume overlay',
      //   id: 'addVolumeOverlay',
      //   click: async () => {
      //     await onAddVolumeOverlayClick();
      //   }
      // },
      // separator
      // { type: 'separator' },
      // open standard
      {
        label: 'Open standard',
        id: 'openStandard',
        submenu: [
          {
            label: 'mni152',
            id: 'mni152',
            click: async () => {
              await openStandard('mni152.nii.gz');
            }
          }
        ]
      },
      // add surface overlay
      // TODO: this should prob be a separate submenu on each surface item to add mesh overlays
      // {
      //   label: 'Add surface overlay',
      //   id: 'addSurfaceOverlay',
      //   click: async () => {
      //     await onAddSurfaceOverlayClick();
      //   }
      // },
    ]
  },
  // Images menu
  // {
  //   label: 'Images',
  //   submenu: [{label: 'No images loaded', id: 'noImages'}],
  //   id: 'images'
  // },
  // add view menu with view options
  {
    label: 'View',
    submenu: [
      {
        label: 'Render',
        id: 'renderView',
        click: async () => {
          onSetViewClick('render');
        },
        type: 'radio',
        // set accelerator to to option+r
        accelerator: 'Option+R'
      },
      {
        label: 'Axial',
        id: 'axialView',
        click: async () => {
          onSetViewClick('axial');
        },
        type: 'radio',
        accelerator: 'Option+A'
      },
      {
        label: 'Sagittal',
        id: 'sagittalView',
        click: async () => {
          onSetViewClick('sagittal');
        },
        type: 'radio',
        accelerator: 'Option+S'
      },
      {
        label: 'Coronal',
        id: 'coronalView',
        click: async () => {
          onSetViewClick('coronal');
        },
        type: 'radio',
        accelerator: 'Option+C'
      },
      {
        label: 'Multi-planar (A+C+S)',
        id: 'multiPlanarViewACS',
        click: async () => {
          onSetViewClick('multiPlanarACS');
        },
        type: 'radio',
        accelerator: 'Option+M'
      },
      {
        label: 'Multi-planar (A+C+S+R)',
        id: 'multiPlanarViewACSR',
        click: async () => {
          onSetViewClick('multiPlanarACSR');
        },
        type: 'radio',
        accelerator: 'Option+Shift+M'
      },
      {
        label: 'Mosaic',
        id: 'mosaicView',
        click: async () => {
          onSetViewClick('mosaic');
        },
        type: 'radio',
        accelerator: 'Option+O'
      },
      {
        label: 'Next frame',
        id: 'nextFrame',
        click: async () => {
          mainWindow.webContents.send('setFrame', 1);
        },
        accelerator: 'Right'
      },
      {
        label: 'Previous frame',
        id: 'previousFrame',
        click: async () => {
          mainWindow.webContents.send('setFrame', -1);
        },
        accelerator: 'Left'
      }
    ]
  },
  // add drag menu
  {
    label: 'Drag',
    submenu: [
      {
        label: 'Pan/zoom',
        id: 'panzoom',
        click: () => {
          mainWindow.webContents.send('setDragMode', 'pan');
        },
        type: 'radio'
      },
      {
        label: 'Measure',
        id: 'measure',
        click: () => {
          mainWindow.webContents.send('setDragMode', 'measure');
        },
        type: 'radio'
      },
      {
        label: 'Window/level', // contrast
        id: 'windowlevel',
        click: () => {
          mainWindow.webContents.send('setDragMode', 'contrast');
        },
        type: 'radio'
      },
      {
        label: 'None',
        id: 'none',
        click: () => {
          mainWindow.webContents.send('setDragMode', 'none');
        },
        type: 'radio'
      }
    ]
  },
  // add window menu with reload options
  {
    label: 'Window',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          BrowserWindow.getFocusedWindow().reload();
        }
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'CmdOrCtrl+Shift+I',
        click: () => {
          BrowserWindow.getFocusedWindow().toggleDevTools();
        }
      }
    ]
  }
];
// Add macOS application menus
if (process.platform === 'darwin') {
  menu.unshift({
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  });
}

Menu.setApplicationMenu(Menu.buildFromTemplate(menu));

