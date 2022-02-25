const { Schema, model} = require('mongoose');

const schemaFollow = new Schema({
    follower: {type: Schema.ObjectId, ref: 'Usuario'},
    followed: {type: Schema.ObjectId, ref: 'Usuario'}
}, {
    timestamps: true,
    versionkey: false
});

module.exports = model('Follow', schemaFollow);