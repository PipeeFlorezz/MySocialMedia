const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Publication = require('../models/publicaciones');
const Follow = require('../models/follow');
const Comments = require('../models/comments');

const moment = require('moment');
moment.locale('es')

const PublicationRouter = new Router();

PublicationRouter.get('/', verify, async (req, res) => {
    /*let followeds = [];
    let follows = await Follow.find({follower: req.user}).populate('followed')
    console.log(follows);
    follows.forEach((follow) => {
        followeds.push(follow.followed);
        console.log(followeds); 
    });
    let publish = await Publication.find({user: {"$in": followeds}})
                                   .sort('-createdAt');*/

    let comentarios = await Comments.find()
        .populate('user publicationId')
    let publish = await Publication.find()
        .sort('-createdAt')
        .populate('user comments')


    return res.json({ publications: [publish, comentarios] });
});

PublicationRouter.post('/addPublish', verify, async (req, res) => {
    console.log(req.user);
    console.log('addPublication: ' + req.file);
    console.log('req.body.text: ' + typeof req.body.text)
    console.log('req.body.text: ' + req.body.text)

    console.log(req.body.text);
    const publication = new Publication();
    publication.user = req.user;
    publication.text = (req.body.text && req.body.text.length >= 1) ? req.body.text : '';;
    publication.created_At = moment().format('LLLL');
    publication.imagePublication = (req.file && req.file.filename) ? req.file.filename : '';
    let publishSaved = await publication.save();
    let Savedpublish = await Publication.findOne({ _id: publishSaved._id }).populate('user');

    return res.json({ Savedpublish });

});

PublicationRouter.put('/addComment', verify, async (req, res) => {
    let commentsIds = [];
    console.log('Ruta para crear comentarios', req.user)
    console.log(req.body.text)
    let body = req.body;

    let comment = new Comments();
    comment.publicationId = body.publicationId;
    comment.user = body.user;
    comment.created_At = moment().format('L') + ' ' + moment().format('LTS');
    comment.text = body.text;
    let savedComent = await comment.save();
    let commentDone = await Comments.findOne({ _id: savedComent._id }).populate('user publicationId')
    let comentarios = await Comments.find({ publicationId: body.publicationId })
        .populate('user publicationId')

    /*comentarios.forEach(element => {
        commentsIds.push(element._id);
    })*/

    let updatedPublish = await Publication.findByIdAndUpdate(commentDone.publicationId, { $set: { comments: comentarios } }, { new: true })
        .populate('user comments')
    return res.json({ publishUpdated: [updatedPublish, commentDone, comentarios] })
})

PublicationRouter.delete('/delete/:id', verify, async (req, res) => {
    console.log('Ruta para eliminar publicacion: ' + req.params.id);
    if(req.params.id){
        let deleted = await Publication.findByIdAndDelete(req.params.id);
        return res.json({Deleted: deleted});
    }
});

PublicationRouter.put('/update/:id', verify, async (req, res) => {
    console.log('Ruta para actualizar publicacion: ' + req.params.id);
    console.log('Req.body: ');
    console.log(req.body)
    let newDatos = req.body;
    if(req.params.id){
        let updatedPublish = await Publication.findByIdAndUpdate(req.params.id, newDatos, {new:true});
        return res.json({updated: updatedPublish});
    }
});



async function verify(req, res, next) {
    if (!req.headers.authorization) return res.json({ noToken: 'No hay token' });

    let token = req.headers.authorization.replace(/['"]+/g, '');
    if (token) {
        console.log('Token desde el verify Funcion' + token);
        let verifyToken = await jwt.verify(token, 'secretkey');
        if (verifyToken) req.user = verifyToken.id;
    }
    next();
}

module.exports = PublicationRouter;