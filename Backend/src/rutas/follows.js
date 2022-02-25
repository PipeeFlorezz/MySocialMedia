const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Follow = require('../models/follow');

const followRouter = new Router();

followRouter.get('/', verify, async (req, res) => {
    console.log('ruta d follows: req.user: ' + req.user);

    let follows = await Follow.find({ follower: req.user }).populate('followed');
    console.log('Follows desde el servidor: ' + follows);
    return res.json({ seguimientos: [follows] });

});

followRouter.get('/followsUser/:id', verify, async (req, res) => {
    console.log('ruta d follows: req.user: ' + req.user);

    let follows = await Follow.find({ follower: req.params.id }).populate('followed');
    console.log('Follows desde el servidor: ' + follows);
    return res.json({ seguimientos: [follows] });

});

followRouter.post('/addFollow', verify, async (req, res) => {
    console.log('followedID: ' + req.body.followed);
    if (req.body.follower && req.body.followed) {
        let follow = new Follow();
        follow.follower = req.body.follower;
        follow.followed = req.body.followed;
        await follow.save();

        return res.status(200).json({ follow });
    } else {
        return res.status(404).json({ response: 'Completa el envio de datos' });
    }
});

followRouter.delete('/delete/:id', verify, async (req, res) => {
    console.log('deleted: ' + req.params.id);
    if (req.params.id) {
        let userDeleted = await Follow.findOneAndDelete({ follower: req.user, followed: req.params.id })
        console.log(userDeleted)
        return res.json({ deleted: 'Has dejado de seguir a un usuario' });
    }
});

async function verify(req, res, next) {
    if (!req.headers.authorization) return res.json({ noToken: 'No hay token' });

    let token = req.headers.authorization.replace(/['"]+/g, '');
    if (token) {
        console.log('Token desde el verify Funcion' + token);
        let verifyToken = jwt.verify(token, 'secretkey');
        if (verifyToken) req.user = verifyToken.id;
        console.log(req.user, verifyToken);
    }
    next();
}

module.exports = followRouter;