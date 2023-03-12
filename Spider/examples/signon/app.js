/**
 * Basic example demonstrating passport-steam usage within Express framework
 */
const axios = require("axios")
var https = require('https');
var fs = require('fs');
var cors = require('cors')
const path = require('path')
var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , session = require('express-session')
  , SteamStrategy = require('../../').Strategy;
require("dotenv").config()



var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const { PrismaClient } = require('@prisma/client');
const { response } = require("express");
const { json } = require("express");

const prisma = new PrismaClient()
const multer  = require('multer');
const { randomUUID } = require("crypto");
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null,  path.join(__dirname + './../../public/profilePicture'))
  },
  filename: function (req, file, cb) {
    console.log(req.user)
    const uniqueSuffix = req.user.user_id
  cb(null,uniqueSuffix+'.'+ 'jpg')
  }
})
const bannerStr = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null,  path.join(__dirname + './../../public/profileBanner'))
  },
  filename: function (req, file, cb) {
    console.log(req.user)
    const uniqueSuffix = req.user.user_id
  cb(null,uniqueSuffix+'.'+ 'jpg')
  }
})

const uploadPostStorage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null,  path.join(__dirname + './../../public/post'))
  },
  filename: function (req, file, cb) {
    console.log(req.user)
    const uniqueSuffix = randomUUID()
  cb(null,uniqueSuffix+'.'+ 'jpg')
  }
})
const upload = multer({ storage: storage })
const uploadPost = multer({ storage: uploadPostStorage })
const bnUpload = multer({ storage: bannerStr })

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Steam profile is serialized
//   and deserialized.

let apiKey = process.env.Key;
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the SteamStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.





const http = require('http').createServer(app);



var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cors())
app.use(session({
  secret: 'your secret',
  name: 'name of session id',
  resave: true,
  saveUninitialized: true
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use('/static',express.static(__dirname + '/../../public'));

const {spawn}= require('child_process')

//const childPython = spawn('python',['--version']);
const childPython = spawn('python',['test.py']);
childPython.stdout.on('data',(data)=>{
  console.log(`stdout:${data}`)
})

childPython.stderr.on('data',(data)=>{
  console.log(`stderr:${data}`)
});
//script
childPython.on('close',(code)=>{
  console.log(`childPython exited with code:${code}`)
}) 



app.get('/saveuser', ensureAuthenticated , async function (req, res) {
 
  //console.log(req.user)
  const fetchUser = await prisma.user.findUnique({
    where: {
      id: req.user.user_id
    }
  })
  if (fetchUser == null) {
    // console.log("user not found ")

    const newUser = await prisma.user.create({
      data: {
        id: req.user.user_id,
        name: req.user.name,
        profilePicture:req.user.picture,
        profileBanner:'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg',
        gmailId:req.user.email,
        activeChoice:true,
        isConnected:true
      },
    })

    console.log("new user created db updated", newUser)
  }else{
    console.log("user exists")
    res.send(JSON.stringify({status:"ok"}))
  }
 
});

app.post('/userNameUpdate',ensureAuthenticated,urlencodedParser,async (req, res)=>{
  console.log(req.body.name);
  const updateUserName=await prisma.User.update({
    where:{
      id:req.user.user_id
    },
    data:{
      name:req.body.name
    }
  })
  res.sendStatus(200);
});


app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});



app.get('/chatData',ensureAuthenticated, async (req, res) => {
  let fetchedChat = await prisma.Chat.findMany({
    where:{
      OR:[
        {
          sender: req.user.uid,
          receiver: req.query.friendId
        },
        {
          sender: req.query.friendId,
          receiver: req.user.uid
        }
      ]
    }
  })
  res.send(JSON.stringify(fetchedChat))
});


app.post('/getUserInfo',ensureAuthenticated,async(req,res)=>{
  const jsonObject = req.body;
  let userData = await prisma.User.findUnique({
    where: {
      id: jsonObject.frnd_id
    }
  })
  res.send(JSON.stringify(userData));
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  var admin = require("firebase-admin");

  var serviceAccount = require("./../../key/firebaseadminkey.json");
  if(!admin.apps.length){
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
  
    });
  }else{
    admin.app()
  }
  
  const { getAuth } = require("firebase-admin/auth")
  if(req.headers['authorization']==null){
    res.sendStatus(400);
    return;
  }
  let idToken = req.headers['authorization'].split(" ")[1]
 
  getAuth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken
      next();
      // console.log(decodedToken);
      // console.log(uid)
      // ...
    })
    .catch((error) => {
      // Handle error
    
        console.log(error)
        res.sendStatus(403)
      
    });
    
  // res.sendStatus(200)
}

app.listen(3000);
http.listen(5000, () => console.log(`Listening on port ${5000}`));

