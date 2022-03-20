const express = require("express") ;
const session = require("express-session") ;

const bcrypts = require("bcrypt") ;
// to store your session
const MongoDBSession = require("connect-mongodb-session")(session) ;

const app = express() ;
const mongoose = require("mongoose") ;
const userModel = require("./models/user");
const user = require("./models/user");

mongoose.connect("mongodb://127.0.0.1:27017/sessions",{

 useNewUrlParser: true ,
 
 useUnifiedTopology: true




})
.then((result)=>{

    console.log("mongodb connected");

},(err)=>{

    console.log(err)
})

;



const mongoURI = "mongodb://127.0.0.1:27017/sessions"
const store = new MongoDBSession({

  uri : mongoURI ,
  collection: "mySession"


})


 // set the view to ejs
app.set("view engine", "ejs");
// body parser to parse the body
app.use(express.urlencoded({ extended: true }));



app.use(session({
 secret: "this is the secret key" ,
 saveUninitialized : false ,
 resave : false ,
 store : store


}))  ;



const isAuth = ((req,res,next)=>{

 if(req.session.isAuth == true){

    next()
 }else {

    res.redirect("/login")
 }



})









app.get("/" ,(req,res)=>{
    req.session.isAuth = true ;
    console.log(req.session) ;
    console.log(req.session.id) ;
    res.render("landing") ;

 // res.send("connected to server") ;
  
}) ;

app.listen(8000, ()=>{

    console.log("listening at port 8000")
})




//=================== Routes
// Landing Page


// Login Page
app.get("/login", (req,res)=>{

 res.render("login")
});


app.post("/login", async(req,res)=>{
    const {email,password} = req.body ;

     const user =  await userModel.findOne({email}) ;

     if(!user) {
 
        return res.redirect("/login") ;



     }
        // compares the password entered with the password in the database
     const isMatch = await bcrypts.compare(password, user.password)

      if(!isMatch){

        res.redirect("/login")
      }

      // check if authenthicated
     req.session.isAuth = true ;
    res.redirect("/dashboard") ;


   });
   


// Register Page
app.get("/register",(req,res)=>{
  
    res.render("register")

});
app.post("/register", async(req,res)=>{

  const {userName, email ,password} = req.body

    // check if email exist from database
  let user = await userModel.findOne({email}) ;

  if(user) {

    return res.redirect("/register")
  }




   const haspswd =  await bcrypts.hash(password,12) ;

    user = new userModel({
  
     userName,
     email ,
     password: haspswd
  

   }) ;

   await user.save() ;
   res.redirect("/login")

});

// Dashboard Page
app.get("/dashboard",isAuth, (req,res)=>{

    res.render("dashboard")

});

app.post("/logout" , (req,res)=>{

   req.session.destroy((err)=>{
    
    if (err)throw err ;
    res.redirect("/")
  
   })
    
});



