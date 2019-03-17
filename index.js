var multer = require('multer')
let express = require('express')
let app = express();

var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({
    storage: storage
}).single('file');

app.use(express.static('./public'));

app.get('/', (res, req) => render('index'))

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log(req.file);
            req.send('File sended')
        }
    })
    })

app.listen(3000)
console.log('listening port')