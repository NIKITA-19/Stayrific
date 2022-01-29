const express=require("express")
const bodyParser = require('body-parser');
var app= express();

//dotenv.config({path:'./config.env'});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const dbConfig =require('./db'); 

const roomsRoute =require('./routes/roomsRoute');
const usersRoute =require('./routes/usersRoute');
const bookingsRoute =require('./routes/bookingsRoute');

app.use('/api/rooms',roomsRoute);
app.use('/api/users',usersRoute);
app.use('/api/bookings',bookingsRoute);

const port=process.env.PORT || 5000;

/*app.get('/',(req,res)=>{
    res.send("Finally !!");
})*/
if(process.env.NODE_ENV==="production"){
    app.use(express.static("client/build"));
    const path= require("path");
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    })
}
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});