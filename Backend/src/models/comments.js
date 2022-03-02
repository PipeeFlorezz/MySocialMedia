const { Schema, model} = require('mongoose');

const schemaComments = new Schema({
    publicationId: {type: Schema.ObjectId, ref: 'Publication'},
    user: {type: Schema.ObjectId, ref: 'Usuario'},
    created_At: String,
    text: String
}, {
    versionkey: false
});

module.exports = model('Comment', schemaComments);
