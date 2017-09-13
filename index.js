const fs = require('fs-extra');
const path = require('path');
const download = require('download');

let defaultDownloadUrl = 'https://ffmpeg.zeranoe.com/builds/win64/static/ffmpeg-20170130-cba4f0e-win64-static.zip';

function removeFFMPEGFolder(tempFolder) {
  if (fs.existsSync(tempFolder)) {
    let files = fs.readdirSync(tempFolder);
    files.filter(file => file.startsWith('ffmpeg-')).forEach(file => fs.removeSync(path.join(tempFolder, file)));
  }
}

/**
 * Ensure ffmpeg utility is available in root folder
 * @param {string} rootPath Root path of executing folder, default: __dirname
 * @param {string} tempFolder Temporary folder for downloads, default: 'temp' (will be cleared)
 * @param {string} downloadUrl The url to download the ffmpeg zip from
 */
function ensureFFMPEG(rootPath, tempFolder, downloadUrl) {

  downloadUrl = downloadUrl || defaultDownloadUrl;
  rootPath = rootPath || 
    __dirname.endsWith('node_modules\\ffmpeg-ensure') || __dirname.endsWith('node_modules/ffmpeg-ensure') ?
    __dirname.substr(0, __dirname.length - 'node_modules/ffmpeg-ensure'.length) :
    __dirname;

  tempFolder = tempFolder || path.join(rootPath, 'temp');
  let ffmpegPath = path.join(rootPath, 'ffmpeg.exe');
  
  if (!fs.existsSync(ffmpegPath)) {

    removeFFMPEGFolder(tempFolder);
    
    return download(downloadUrl, tempFolder, { extract: true, filename: 'ffmpeg' })
      .then(() => {
        let files = fs.readdirSync(tempFolder);
        files = files.filter(file => file.startsWith('ffmpeg-'));

        if (files.length === 0) { throw new Error('Couldn\'t find any downloaded folder'); }

        let extractFolder = files[0];
        fs.copySync(path.join(tempFolder, extractFolder, 'bin', 'ffmpeg.exe'), ffmpegPath);
      })
      .catch(() => console.log('Failed to download ffmpeg'))
      .then(() => {
        removeFFMPEGFolder(tempFolder);
      });
  }

  return Promise.resolve();
}

module.exports = { ensureFFMPEG }