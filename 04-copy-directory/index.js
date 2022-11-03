
const fs = require('fs')
const path = require('path')


async function createDir() {
  return new Promise((resolve, reject) => 
  fs.mkdir(path.resolve(__dirname, 'files-copy'), {recursive: true}, (err) => {

    if (err) {
      return reject(err.message)
    }

    console.log('Папка files-copy создана')
    resolve()
  }))
}

async function deleteFileDir() {
  return new Promise((resolve, reject) => 
  fs.readdir(path.resolve(__dirname, 'files-copy'), (err, data) => {

    if (err) {
      return reject(err.message)
    }

    data.forEach(file => {
      fs.unlink(path.resolve(__dirname, 'files-copy', file), (err) => {
        if (err) {
          console.log(err.message)
          return
        }
      })
    })
    resolve()
  }))
}

async function copyFileDir() {
  return new Promise((resolve, reject) => 
  fs.readdir(path.resolve(__dirname, 'files'), (err, data) => {

    if (err) {
      return reject(err.message)
    }

    data.forEach(file => {
      fs.copyFile(path.resolve(__dirname, 'files', file), path.resolve(__dirname, 'files-copy', file), (err) => {
        if (err) {
          console.log(err.message)
          return
        }
      })
    })
    resolve()
  }))
}

createDir()
.then(() => deleteFileDir())
.then(() => copyFileDir())
.catch((err) => console.log(err))