
const fs = require('fs')
const path = require('path')


async function writeFile() {
  return new Promise((resolve, reject) => 
  fs.writeFile(path.resolve(__dirname, 'project-dist', 'bundle.css'), '', (err) => {
    if (err) {
      return reject(err.message)
    }
    console.log('Файл bundle.css создан');
    resolve();
  }));
}


async function appendFile() {
  return new Promise((resolve, reject) => 
  fs.readdir(path.resolve(__dirname, 'styles'), (err, data) => {

    if (err) {
      return reject(err.message)
    }
    
    data.forEach(file => {
      let format = path.extname(file)
      if (format === '.css') {
        const stream = fs.createReadStream(path.resolve(__dirname, 'styles', `${file}`), 'utf-8')
        stream.on('data', (chank) => {
          fs.appendFile(path.resolve(__dirname, 'project-dist', 'bundle.css'), chank + '\n', (err) => {
            if (err) {
              console.log(err.message)
              return
            }
          })
        })
      }
    })
    resolve();
  }))
}

writeFile()
.then(() => appendFile())
.catch((err) => console.log(err))