const { model, Schema} = require('mongoose');

let schema = new Schema({
    user: {type: Schema.ObjectId, ref: 'Usuario'},
    publication: {type: Schema.ObjectId, ref: 'Publication'},
    like: {type: Boolean, default: false}
})


module.exports = model('Like', schema);

