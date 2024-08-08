const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient ;
let _db;

const mongoConnect = cb => {
    MongoClient.connect('mongodb+srv://Elshirbini:Aa5527980098@cluster0.ufoahrq.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
        .then(client => {
            console.log('Connected!');
            _db = client.db('shop');
            cb()
        })
        .catch(err =>{
            console.log(err);
            throw err;
        })
}

const getDb = () => {
    if(_db){
        return _db;
    }
    throw 'No Database Found!!'
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;