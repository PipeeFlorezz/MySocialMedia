const { Schema, model} = require('mongoose');

const schemaMessage = new Schema({
    emitter: {type: Schema.ObjectId, ref: 'Usuario'},
    reciever: {type: Schema.ObjectId, ref: 'Usuario'},
    created_At: String,
    text: String
}, {
    versionkey: false
});

module.exports = model('Message', schemaMessage);

