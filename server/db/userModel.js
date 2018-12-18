const mongo = require('mongoose');

const userSchema = new mongo.Schema({
    ID: {type:String, required:true, unique:true, index:true},
    PW: {type:String, required:true},
    friends: [{type:mongo.SchemaTypes.ObjectId,ref:'User'}],
    profile_img:{type:Buffer, default:null},
    profile_ment:{type:String, default:""}
})

module.exports = mongo.model('User', userSchema);