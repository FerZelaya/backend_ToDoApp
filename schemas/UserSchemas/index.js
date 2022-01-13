var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    roles: {type: Array, required: true}
}, {collection: 'users'})

var UserController = mongoose.model('UserController', UserSchema)


module.exports = UserController; 