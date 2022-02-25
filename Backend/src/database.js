const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mySocialApp')
    .then((db) =>{
        console.log('Te has conectado a la base de datos');
    })
    .catch((error) => {
        console.log('ha ocurrido un error' + error);
    });