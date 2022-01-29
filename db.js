const  mongoose  = require("mongoose");

var mongoURL= 'mongodb+srv://tarun:9565@cluster0.av3qj.mongodb.net/mern-rooms?authSource=admin&replicaSet=atlas-10ozw9-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'

mongoose.connect(mongoURL, {useUnifiedTopology : true, useNewUrlParser:true})

var connection = mongoose.connection;

connection.on('error', ()=>{
    console.log('Mongo DB Connection failed');
})

connection.on('connected', ()=>{
    console.log('Mongo DB Connection successful');
})
module.exports=mongoose