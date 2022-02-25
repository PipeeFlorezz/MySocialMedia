const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Database
require('./database');

// Settings
app.set('port', 3000);

// set images
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/imgs'),
    filename: (req, filename, cb) => {
        cb(null, new Date().getMilliseconds() + path.extname(filename.originalname));
    }
});

//midelwares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(multer({storage}).single('image'));

// rutas
app.use('/users', require('./rutas/userRoutes'));
app.use('/publications', require('./rutas/publicationsRoutes'));
app.use('/follows', require('./rutas/follows'));
app.use('/messagess', require('./rutas/messagess'));

// archivos estaticos
app.use('/', express.static(path.resolve('src/public/imgs')));

app.listen(app.get('port'), () => {
    console.log('node en el puerto: ' + app.get('port'));
    console.log('Objeto __dirname: ' + __dirname);
    console.log('PathResolve: ' + path.resolve());
});

