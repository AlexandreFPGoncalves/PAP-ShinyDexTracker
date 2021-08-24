//Imports
const express       = require("express");
const app           = express();
const User          = require("./models/User");
const Shiny         = require("./models/Shinies");
const Pokemon       = require("./models/Pokemon");
const path          = require("path");
const mongoose      = require('mongoose');
const bcrypt        = require("bcrypt");
const session       = require("express-session");
var   isLoged       = false;
const methodOverride = require("method-override");

//Data Base connection
mongoose.connect('mongodb://localhost:27017/SDT', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log("Mongo Connection Open...")
    })
    .catch(() =>{
        console.log("Mongo Connection Error...", err);
    });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


//middleware
const requireLogin = (req,res,next) => {
    if(!req.session.user_id){
        return res.redirect("/login");
    }
    next();
}

app.set("views", path.join(__dirname,"views"));
app.use(express.static("assets"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(session({ secret: "cookie_secret", name: "cookie_name", resave: false, saveUninitialized: false }));
app.use(methodOverride("_method"));


// ------ Default Routes #START ------
app.get('/', async (req, res) => {
    const AlexShinies = await Shiny.find({}).sort({_id: -1}).limit(8);
    const userName = req.session.username;
    res.render('index', {isLoged , userName, AlexShinies});
})

app.get('/faq', (req, res) => {
    userName = req.session.username;
    res.render('faq', {isLoged, userName})
})

app.get('/counter', (req, res) => {
    userName = req.session.username;
    res.render('counter', {isLoged, userName})
})
// ------ Default Routes #END ------

// ------ Admin Route #START ------
app.get('/admin', async (req, res) => {
    if(!req.session.user_id){
        res.redirect("/login")
    }

    const userName = req.session.username;
    const dadosUser = await User.findOne({userName});
    console.log(dadosUser.isAdmin);

    
    
    res.render('counter', {isLoged, userName})
})
// ------ Admin Route #END ------



// ------ Profile #START ------
app.get(`/profile/:username`, async (req, res) => {

    const { username } = req.params;
    const dadosUser = await User.findOne({username});

    if(dadosUser){
        const userName = dadosUser.username;
        const sessionUsername = req.session.username;
        const userShinies = await Shiny.find({trainer: dadosUser._id});
        res.render("profile/",{dadosUser, userName, isLoged, userShinies, sessionUsername}); 
    }else{
        res.redirect("/404");
    };
    
})
// ------ Profile #END ------



// ------ Shinies #START ------
app.get('/profile/:username/addShiny', async (req, res) => {
    if(!req.session.user_id){
        res.redirect("/login")
    }
    const { username } = req.params;
    const dadosUser = await User.findOne({ username: username });
    const userName = dadosUser.username;
    res.render('addShiny', {dadosUser, userName})
})

app.post('/profile/:username/addShiny', async (req, res) => {
    const { trainer, pokemon_name, pokemon_nickname, encounters, method, pokeball, caught_game, gender, shiny_charm, caught_date } = req.body;
    const trainerID = req.session.user_id;
    const userName = req.session.username;
    const pokemonData = await Pokemon.find( { data : { $elemMatch : { name : pokemon_name } } } )
    console.log(pokemonData);
    const newShiny = new Shiny({
        trainer : trainerID,
        trainer_name: userName,
        dex: pokemonData.dex,
        pokemon_name,
        pokemon_nickname,
        encounters,
        method,
        pokeball,
        caught_game,
        gender,
        shiny_charm,
        caught_date
    })
    await newShiny.save();
    res.redirect(`../${trainer}`);

})


app.get('/profile/:username/:id/editShiny', async (req, res) => {
    if(!req.session.user_id){
        res.redirect("/login")
    }
    const { username } = req.params;
    const { id } = req.params;
    const dadosUser = await User.findOne({username});
    const userShinies2 = await Shiny.findOne({_id: id});
    const validShinyID = mongoose.Types.ObjectId.isValid(id);
    const userShinies = await Shiny.find({trainer:req.session.user_id});


    console.log(validShinyID);

if(dadosUser){
    if(userShinies2){
        if(req.session.username != dadosUser.username){
            res.redirect("/404");
        }else if(validShinyID == false){
            res.redirect("/404");    
            }else{
                res.render("editShiny", {dadosUser, userShinies, userShinies2});
            }
        }else{
            res.redirect("/404");
        }
    }else{
        res.redirect("/404");
    }

})

app.put('/profile/:username/:id', async (req, res) => {
    const { username } = req.params;
    const { id } = req.params;
    const shinyUpdate = await Shiny.findByIdAndUpdate(id, req.body, {runValidators: true});
    res.redirect(`../../profile/${username}`);
})

app.delete('/profile/:username/:id', async (req, res) => {
    const { username } = req.params;
    const { id } = req.params;
    await Shiny.findByIdAndDelete(id);
    res.redirect(`../../profile/${username}`);
})

// ------ Shinies #END ------


// ------ Register #START ------
app.get("/register", (req, res) => {
    res.render("register");
})
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password,12);
    const user = new User({
        username,
        email,
        password: hash
    })
    await user.save();
    req.session.user_id = user._id;
    req.session.username = user.username;
    isLoged = true;
    res.redirect(`profile/${user.username}`);
})
// ------ Register #END ------


// ------ Login #START ------
app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/loginError", (req, res) => {
    res.render("loginError");
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user){
        res.render("loginError");
    }else{
        const validPassword = await bcrypt.compare(password, user.password);
        if(validPassword){
            req.session.user_id = user._id;
            req.session.username = user.username;
            isLoged = true;
            req.session.shinies = user.shinies;
            res.redirect(`profile/${req.session.username}`);
        }else{
            res.render("loginError");
        }
    }
})
// ------ Login #END ------


// ------ Logout #START ------

app.get("/logout", (req, res) => {
    if(!req.session.user_id){
        res.redirect("/login")
    }
    const userName = req.session.username;
    res.render("logout", {isLoged, userName});
})

app.post("/logout", (req, res) => {
    req.session.user_id = null;
    req.session.username = null;
    isLoged = false;
    res.redirect("/");
})
// ------ Logout #END ------

app.get("/404", (req, res) => {
    
    const userName = req.session.username;
    res.render("error404", {isLoged, userName});
})


//Check para ver se o server esta ligado.
app.listen(8080, function(){
    console.log("Listening on Port 8080")
})
