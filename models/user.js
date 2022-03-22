const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passwortLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String ,
        required: true
    }
})
UserSchema.plugin(passwortLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
