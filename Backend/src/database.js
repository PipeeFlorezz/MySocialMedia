const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/mySocialApp')
    .then((db) =>{
        console.log('Te has conectado a la base de datos');
    })
    .catch((error) => {
        console.log('ha ocurrido un error' + error);
    });

    /*
127.0.0.1

    */