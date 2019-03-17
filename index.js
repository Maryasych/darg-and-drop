const multer = require('multer'),
 express = require('express'),
 path = require('path')
 app = express();

var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },
})

var upload = multer({
            fileFilter: function (req, file, cb) {
                let mimes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
                if (mimes.some(mime => mime == file.mimetype)) {
                        cb(null, true)
                    } else {
                        cb("Недопустиме розширення файлу!")
                    };
                },
                storage: storage
            }).single('file');


        app.use(express.static('./public'));

        app.get('/', (res, req) => render('index'))

        app.post('/upload', (req, res) => {
            upload(req, res, (err) => {
                if (err) {
                    res.send(err)
                } else {
                    res.sendStatus(200)
                }
            })
        })

        app.listen(3000); console.log('listening port')