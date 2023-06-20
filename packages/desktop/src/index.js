const { app, BrowserWindow, Menu, MenuItem, ipcMain} = require('electron');
const path = require('path');
const { fork } = require("child_process");
const {devPorts} = require('./devPorts');
const {events} = require('./events');

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
let mainWindow = {};

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
  // process.argv is an array of the command line arguments
  // the first two are the path to the node executable and the path to the script being run
  // the third is the first argument passed to the app
  // if it's "--dev", we're in development mode
  return process.argv[2] === '--dev';
}

/**
 * Registers IPC listeners for the events object.
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
    // get user home directory
    const homeDir = app.getPath('home');
    mainWindow.loadFile(path.join(homeDir, '.niivuegui', guiName, 'index.html'));
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
  registerIpcListeners();
  createWindow();
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
      }
    }));
  }

  Menu.setApplicationMenu(appMenu)
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
  updateImagesMenu(files.filePaths);
}



// create an application menu
let menu = [
  // add file menu with load volumes option
  {
    label: 'File',
    submenu: [
      {
        label: 'Load volumes',
        id: 'loadVolumes',
        click: async () => {
          await onLoadVolumesClick();
        }
      }
    ]
  },
  // Images menu
  {
    label: 'Images',
    submenu: [{label: 'No images loaded'}],
    id: 'images'
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

