
const fs = require('fs')
const path = require('path')


async function createDir(path) {
  return new Promise((resolve, reject) => 
  fs.mkdir(path, {recursive: true}, (err) => {

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

async function fillIndexHtml() {  
  return new Promise((resolve, reject) => 
  fs.readFile(path.resolve(__dirname, 'template.html'), 'utf-8', (err, data) => {

    if (err) {
      return reject(err.message)
    }
    dataHtml = data.split("\n")
    
    dataHtml.forEach(tag => {
      
      if (tag.includes("{{header}}")) {
        fs.readFile(path.resolve(__dirname, 'components', 'header.html'), 'utf-8', (err, htmlChank) => {        
          if (err) reject(err.message);
          tag = htmlChank          
        })        
      }
      else if (tag.includes("{{footer}}")) {
        fs.readFile(path.resolve(__dirname, 'components', 'footer.html'), 'utf-8', (err, htmlChank) => {        
          if (err) reject(err.message);
          tag = htmlChank          
        })        
      }
      else if (tag.includes("{{articles}}")) {
        fs.readFile(path.resolve(__dirname, 'components', 'articles.html'), 'utf-8', (err, htmlChank) => {        
          if (err) reject(err.message);
          tag = htmlChank          
        })        
      }
      else if (tag.includes("{{about}}")) {
        fs.readFile(path.resolve(__dirname, 'components', 'about.html'), 'utf-8', (err, htmlChank) => {        
          if (err) reject(err.message);
          tag = htmlChank          
        })        
      }
    })    
    resolve()       
  })) 
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
.then(() => fillStylesCss())
.then(() => writeFile(path.resolve(__dirname, 'project-dist', 'index.html'), (dataHtml.join("\n"))))

.catch((err) => console.log(err))