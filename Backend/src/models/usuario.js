const { model, Schema } = require('mongoose');
let bcrypt = require('bcryptjs');
const usuarioSchema = new Schema({
    email: String,
    surname: String,
    password: String,
    imagePath: String
}, {
    timestamps: true,
    versionkey: false
});

usuarioSchema.methods.encryptPassword = async (password) => {
    let salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

usuarioSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
}
  
module.exports = model('Usuario', usuarioSchema);