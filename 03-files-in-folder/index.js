const fs = require('fs');
const path = require('path');


fs.readdir(path.resolve(__dirname, 'secret-folder'), (error, data) => {

  if (error) {
    console.log(error);
    return;
  }

  else {
    data.forEach (file => {
      fs.stat(path.resolve(__dirname, 'secret-folder', file), (error, stats) => {
        if (error) {
          console.log(error);
          return;
        }
        else {
          if (!stats.isDirectory()) {
            let format = path.extname(file);
            let name = path.basename(file, format);            
            console.log(`${name} - ${format.slice(1)} - ${(stats.size / 1024).toFixed(2)} kb`);
          }
        }
      })
    })
  }  
});
