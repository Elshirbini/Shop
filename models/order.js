const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderShema = new Schema({
    products : [{
        product : {type : Object , required : true},
        quantity : {type : Number , required : true}
    }],
    user : {
        email : {type : String , required : true },
        userId : {
            type : Schema.Types.ObjectId,
            ref : 'users',
            required : true 
        }
    }
})

module.exports = mongoose.model('orders' , orderShema);