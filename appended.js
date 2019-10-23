const fs = require('fs')
const path = require('path')

const env = process.env.NODE_ENV
console.log(`当前环境---------${env}`)
let readerStream;
if(env !== "production") {
    return
}else {
    readerStream = fs.createReadStream('pro_index.html');
}

const outName = path.join(__dirname,'./public','index.html')

var writerStream = fs.createWriteStream(outName);

readerStream.pipe(writerStream);

