
const fs = require('fs')
const path = require('path')


async function createDir(path) {
  return new Promise((resolve, reject) =>
    fs.mkdir(path, { recursive: true }, (err) => {

      if (err) {
        return reject(err.message)
      }

      resolve()
    }))
}


async function writeFile(path, data) {
  return new Promise((resolve, reject) =>
    fs.writeFile(path, data, (err) => {

      if (err) {
        return reject(err.message)
      }

      resolve();
    }));
}


async function fillStylesCss() {
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
            fs.appendFile(path.resolve(__dirname, 'project-dist', 'style.css'), chank + '\n', (err) => {
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


async function copyFileDir(oldPath, newPath) {
  return new Promise((resolve, reject) =>
    fs.readdir(oldPath, (err, data) => {

      if (err) {
        return reject(err.message)
      }

      data.forEach(file => {
        fs.copyFile(path.resolve(oldPath, file), path.resolve(newPath, file), (err) => {
          if (err) {
            console.log(err.message)
            return
          }
        })
      })
      resolve()
    }))
}

let dataHtml;

function fillIndexHtml() {

  fs.readFile(path.resolve(__dirname, 'template.html'), 'utf-8', async (err, data) => {
    if (err) console.error(err.message)

    // dataHtml = data.split("\n")
    dataHtml = data

    fs.readdir(path.resolve(__dirname, 'components'), async (err, files) => {
      if (err) console.error(err.message);

      for (let file of files) {
        const fileName = file.replace(/.html/g, '');
        if (dataHtml.includes(`{{${fileName}}}`)) {
          const fileComponents = path.resolve(path.resolve(__dirname, 'components'), file)

          await fs.promises.readFile(fileComponents)
            .then(async fileData => {
              dataHtml = dataHtml.replaceAll(`{{${fileName}}}`, fileData);

              await fs.promises.writeFile(path.resolve(__dirname, 'project-dist', 'index.html'), dataHtml, (err) => {
                if (err) { console.error(err.message); }
              })
            })
        }
      }

    })
  })
}


createDir(path.resolve(__dirname, 'project-dist'))
  .then(fillIndexHtml())
  .then(() => createDir(path.resolve(__dirname, 'project-dist', 'assets')))
  .then(() => createDir(path.resolve(__dirname, 'project-dist', 'assets', 'fonts')))
  .then(() => createDir(path.resolve(__dirname, 'project-dist', 'assets', 'img')))
  .then(() => createDir(path.resolve(__dirname, 'project-dist', 'assets', 'svg')))

  .then(() => copyFileDir(path.resolve(__dirname, 'assets', 'fonts'),
    path.resolve(__dirname, 'project-dist', 'assets', 'fonts')))

  .then(() => copyFileDir(path.resolve(__dirname, 'assets', 'img'),
    path.resolve(__dirname, 'project-dist', 'assets', 'img')))

  .then(() => copyFileDir(path.resolve(__dirname, 'assets', 'svg'),
    path.resolve(__dirname, 'project-dist', 'assets', 'svg')))

  .then(() => writeFile(path.resolve(__dirname, 'project-dist', 'style.css'), ''))

  .then(() => writeFile(path.resolve(__dirname, 'project-dist', 'index.html'), ''))
  .then(() => fillStylesCss())
  .catch((err) => console.log(err))




// writeFile(path.resolve(__dirname, 'project-dist', 'index.html'), dataHtml.toString().join("\n"))