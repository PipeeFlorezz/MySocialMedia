const { Router, json } = require('express');
const jwt = require('jsonwebtoken');
const Publication = require('../models/publicaciones');
const Follow = require('../models/follow');
const Comments = require('../models/comments');
const Likes = require('../models/likes');

const moment = require('moment');
moment.locale('es')

const PublicationRouter = new Router();

PublicationRouter.get('/:id?', verify, async (req, res) => {

    if(req.params.id){
        let profilePost = await Publication.find({user: {"$in": req.params.id}}).sort('-created_At')
        .populate('user comments likes')
            
        return res.json({profile: profilePost});
    }else {
        let followeds = [];
    
        let follows = await Follow.find({ follower: req.user }).populate('followed')
        console.log(follows);
        follows.forEach((follow) => {
            followeds.push(follow.followed);
            console.log(followeds);
        });
    
        followeds.push(req.user);
        let publish = await Publication.find({ user: { "$in": followeds } })
            .sort('-created_At').populate('user comments likes');
        console.log(publish)
        let comentarios = await Comments.find()
            .populate('user publicationId')
    
    
        return res.json({ publications: [publish, comentarios] });
    }


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
    comment.user = req.user;
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
    if (req.params.id) {
        let deleted = await Publication.findByIdAndDelete(req.params.id);
        return res.json({ Deleted: deleted });
    }
});

PublicationRouter.put('/update/:id', verify, async (req, res) => {
    console.log('Ruta para actualizar publicacion: ' + req.params.id);
    console.log('Req.body: ');
    console.log(req.body)
    let newDatos = req.body;
    if (req.params.id) {
        let updatedPublish = await Publication.findByIdAndUpdate(req.params.id, newDatos, { new: true });
        return res.json({ updated: updatedPublish });
    }
});

PublicationRouter.put('/update/like/:id', verify, async (req, res) => {
    let publishID = 'id de la publicaciont: ' + req.params.id

    let liked = await Likes.findOne({ user: req.user, publication: req.params.id });
    if (liked) {
        liked.like = !liked.like;
        await Likes.findByIdAndDelete(liked._id);
        let likesPerPublish = await Likes.find({ publication: req.params.id }).count()
        //let Nblikes = likesPerPublish.length;
        let updatedPublish = await Publication.findByIdAndUpdate(req.params.id, { numberLikes: likesPerPublish  })
        return res.json({ lks: likesPerPublish });

    } else {
        let body = req.body;
        let like = new Likes();
        like.user = body.user;
        like.publication = body.publication;
        like.like = true;
        let savedLike = await like.save();
        let likesPerPublish = await Likes.find({ publication: savedLike.publication });
        let NumberLikes = likesPerPublish.length;
        let updatedPublish =
            await Publication.findByIdAndUpdate(savedLike.publication, { $set: { likes: likesPerPublish, numberLikes: NumberLikes } }, { new: true })
                .populate('user comments likes');
    
        let publications = await Publication.find().populate('user comments likes');
        return res.json({ likes: { body, savedLike, likesPerPublish, updatedPublish, NumberLikes, publications } });
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