const Express = require("express");
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');

const app = Express();

app.set('view engine','ejs');

//setup body parser
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended:true}));

Mongoose.Promise = global.Promise;
Mongoose.connect("mongodb://localhost:27017/Moviedb",{
    useNewUrlParser:true
}).then( () =>{
    console.log("Successfully connected to the database");
}).catch( err =>{
    console.log("Could not connect to the database",err);
    process.exit();
});


const MovieModel = Mongoose.model("movie",{
    name: String,
    img: String,
    summary: String
});

app.get('/',function(Request,Response,next){
    res.send("Hello this is root page");
});
//creating movie data
app.post("/movie",async(Request,Response,next) =>{
    try{
        var movie = new MovieModel(Request.body);
        var result = await movie.save();
        Response.send(result);
    }catch(error){
        Response.status(500).send(error);
    }
});
//retrieving all movies
app.get("/movies",(Request,Response) => {
    MovieModel.find({},function(err,results){
        if(err){
            Response.status(500).send(err);
        }
        else{
            Response.render('home',{'title':'movies','results':results,message:''});
        }
    });
});
//Retrieving movie by id
app.get("/movies/:id",async(Request,Response,next) => {
    try{
        var result = await MovieModel.findById(Request.param.id).exec();
        Response.send(result);
    //res.send(JSON.stringify(rerq.body));
    }catch(error){
        Response.status(500).send(error);
    }
});
app.listen(7001, function(){
    console.log("Sever is running on port 7001")
});