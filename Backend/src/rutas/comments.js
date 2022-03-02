const { Router } = require('express');
const routerComments = new Router();
const jwt = require('jsonwebtoken');
const Comments = require('../models/comments');
const moment = require('moment');
moment.locale('es');

/*routerComments.post('/addComment', verify, async (req, res) => {
    console.log('Ruta para crear comentarios' + req.body, req.user)
        let body = req.body;
        let comment = new Comments();
        comment.publicationId = body.publicationId;
        comment.user = body.user;
        comment.created_At = moment().format('L') + ' ' + moment().format('LTS');
        comment.text = body.text;
        let savedComent = await comment.save();
        let getComent = await Comments.findOne({id: savedComent._id})
        .populate('user publicationId').sort('-created_At')
        return res.json({ addedComent: getComent })

});*/

routerComments.get('/', verify, async (req, res) => {
    console.log('ruta get comentarios: ' + req.user)

    let coments =  await Comments.find().populate('user publicationId')
        .sort('-created_At')

    return res.json({ allComments: coments })
})

async function verify(req, res, next) {
    if (!req.headers.authorization) return res.json({ noToken: 'No hay token' });

    let token = req.headers.authorization.replace(/['"]+/g, '');
    if (token) {
        console.log('Token desde el verify Funcion' + token);
        let verifyToken = await jwt.verify(token, 'secretkey');
        if (verifyToken) req.user = verifyToken.id;
        console.log(req.user, verifyToken);
    }
    next();
}

module.exports = routerComments;