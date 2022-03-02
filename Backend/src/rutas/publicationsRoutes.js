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


    let publish = await Publication.find()
        .sort('-createdAt')
        .populate('user comment')
    console.log('publicationRoutes: ' + publish);
    console.log('rutadepiblication/', req.user);
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
    return res.json({ publications: [publish] });
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

PublicationRouter.put('/addComment', verify, async (req,res) => {
    console.log('Ruta para crear comentarios' , req.user)
    console.log(req.body.text)
    let body = req.body;
    let comment = new Comments();
    comment.publicationId = body.publicationId;
    comment.user = body.user;
    comment.created_At = moment().format('L') + ' ' + moment().format('LTS');
    comment.text = body.text;
    let savedComent = await comment.save();
    let commentDone = await Comments.findOne({_id: savedComent._id})
    let updatedPublish = await Publication.findByIdAndUpdate(commentDone.publicationId, {comment: commentDone._id}, {new: true})
        .populate('comment user')
    return res.json({publishUpdated: [updatedPublish, commentDone]})
})

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