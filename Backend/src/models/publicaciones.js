const { model, Schema } = require('mongoose');

let schema = new Schema({
    user: {type: Schema.ObjectId, ref: 'Usuario'},
    text: String,
    imagePublication: String,
    created_At: String
}, {
    timestamps: true,
    versionkey: false
});


module.exports = model('Publication', schema);