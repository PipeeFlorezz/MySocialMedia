const { Router } = require('express');
const routerMessagess = new Router();
const jwt = require('jsonwebtoken');
const Messages = require('../models/messages');
const moment = require('moment');
moment.locale('es');

routerMessagess.get('/mensajesTotales', verify, async (req, res) => {
    console.log('Ruta demensajes');

        let messagess = await Messages.find()
        .sort('-created_At')
        .populate('emitter reciever')
        return res.json({messagess});
});

routerMessagess.get('/enviadosRecibidos/:id?', verify, async (req, res) => {
    console.log('Ruta demensajes');
    if(req.params.id){
        let msjSended = await Messages.find({emitter: req.params.id})
        .sort('-created_At')
        .populate('emitter reciever');
        return res.json({msjSended});
    }else{
        let msjGotten = await Messages.find({reciever: req.user})
        .sort('-created_At')
        .populate('emitter reciever');
        return res.json({msjGotten}); 
    }
});

routerMessagess.post('/addMessage', verify, async (req, res) => {
    console.log(req.user);
    console.log('req.body.text: ' + req.body.text);
    let mesage = new Messages();
    if(req.body.text && req.user){
        mesage.emitter = req.body.emitter;
        mesage.reciever = req.body.reciever;
        mesage.created_At = moment().format('L') +' ' + moment().format('LTS');
        mesage.text = req.body.text;
        await mesage.save();

        return res.status(200).json({mesage});
    }else {
        return res.status(404).json({response: 'Envia completamente los datos'});
    }
});

async function verify(req, res, next){
    if(!req.headers.authorization) return res.json({noToken: 'No hay token'});

    let token = req.headers.authorization.replace(/['"]+/g, '');
    if(token){
        console.log('Token desde el verify Funcion' + token);
        let verifyToken = await jwt.verify(token, 'secretkey');
        if(verifyToken) req.user = verifyToken.id;
        console.log(req.user, verifyToken);
    }
    next();
}

module.exports = routerMessagess;