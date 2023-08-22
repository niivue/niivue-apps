// require fs and path
const fs = require('fs').promises
const path = require('path')
const util = require('util') // node.js utility module for promisify

// command line options
let commandLineArgs = {};

/**
 * gets the file server port and host from the environment variables
 * @async
 * @function
 * @returns {Promise<Object>} A promise that resolves to an object containing the file server port and host.
 */
async function onGetCommsInfo() {
    let fileServerPort = process.env.NIIVUE_FILESERVER_PORT;
    let host = process.env.NIIVUE_HOST;
    let route = 'file';
    let queryKey = 'filename';
    return {fileServerPort, host, route, queryKey};
}

/**
 * Handles the openFileDialog command.
 * @async
 * @function
 * @param {Array} filters - An array of objects with name and extensions properties.
 * @see https://www.electronjs.org/docs/latest/api/dialog#dialogshowopendialogbrowserwindow-options
 * @returns {Promise<Object>} A promise that resolves to an object with, cancelled, filePaths, and bookmarks properties.
 */
async function onFileDialog(filters=[]) {
    const { dialog } = require('electron')
    const result = await dialog.showOpenDialog({filters:filters, properties: ['openFile', 'multiSelections'] })
    return result
}

/**
 * Handles the openSaveFileDialog command.
 * @async
 * @function
 * @returns {Promise<Object>} A promise that resolves to an object with, cancelled, filePaths, and bookmarks properties.
 */
async function onSaveFileDialog() {
    const { dialog } = require('electron')
    const result = await dialog.showSaveDialog({ properties: ['createDirectory', 'showOverwriteConfirmation'] })
    console.log(result)
    return result
}

/**
 * Sets global command line args
 * @param {Object} args 
 */
function onSetCommandLineArgs(args) {
    commandLineArgs = args;
    console.log('command line args set to ' + args);
}

/**
 * Gets the global command line args
 * @returns {Object} command line args object 
 */
async function onGetCommandLineArgs() {
    console.log('command line args requested');
    return commandLineArgs;
}

async function sendDocument(doc) {
    console.log('document received');
    console.log(doc);
}

const events = {
    openFileDialog: onFileDialog,
    openSaveFileDialog: onSaveFileDialog,
    getCommsInfo: onGetCommsInfo,
    setCommandLineArgs: onSetCommandLineArgs,
    getCommandLineArgs: onGetCommandLineArgs,
    sendDocument: sendDocument
}

module.exports.events = events

