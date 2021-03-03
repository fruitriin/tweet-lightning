/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

const { app } = require('electron');

app.whenReady().then(() => {
    installExtension(VUEJS_DEVTOOLS)
        .catch((err) => console.log('An error occurred: ', err));
});

require('./main.js')
