const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
module.exports = ()=>{
    function connect(){
        mongoose.connect('mongodb://localhost:27017/MFD')
            .then(() => {
                console.log('Success connecting mongodb');
            }).catch((err) => {
                console.error(err);
            });
        require('./userModel');
    }
    connect();
    mongoose.connection.on('disconnected', connect);
}