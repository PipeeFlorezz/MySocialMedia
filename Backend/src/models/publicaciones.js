const { model, Schema } = require('mongoose');

let schema = new Schema({
    user: {type: Schema.ObjectId, ref: 'Usuario'},
    comments: [{type: Schema.ObjectId, ref: 'Comment'}],
    text: String,
    imagePublication: String,
    created_At: String,
    likes: Number
}, {
    timestamps: true,
    versionkey: false
});

 
module.exports = model('Publication', schema);