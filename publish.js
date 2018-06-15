var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../devchattester-aa16.zip');
var kuduApi = 'https://devchattester-aa16.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$devchattester-aa16';
var password = 'xwlaFM9oe2aKXr2ruhmfhx5p3uRQ0fQiTSGwgJY8q60k9aRF1FQr0aWitAXN';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('devchattester-aa16 publish');
  } else {
    console.error('failed to publish devchattester-aa16', err);
  }
});