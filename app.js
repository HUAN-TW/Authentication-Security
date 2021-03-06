//jshint esversion:6
require('dotenv').config()
const express =require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const req = require('express/lib/request')
const res = require('express/lib/response')
const encrypt = require('mongoose-encryption')
const app = express()

// console.log(process.env.API_KEY) 測試
app.use(express.static('public'))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true})

const userSchema= new mongoose.Schema({
    email: String,
    password: String
})


userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields:['password']})

const User = new mongoose.model("User",userSchema)

app.get('/',(req,res) =>{
    res.render('home')
})

app.get('/login', (req,res) =>{
    res.render("login",{errMsg: "", username: "", password: ""})

})

app.get('/register', (req,res) =>{
    res.render("register")
})

app.post('/register',(req,res) =>{
    const newUser= new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function(err){

        if(err){
            console.log(err)
        }else{
            res.render("secrets")
        }
    })
})

app.post('/login',(req,res) =>{
    const username = req.body.username
    const password = req.body.password
    User.findOne({email: username},(err, founduser) =>{
        if(err){
            console.log(err)
        }else{
            if(founduser){
                if(founduser.password === password){
                    res.render("secrets")
                }
                else{
                    res.render("login", {errMsg: "Email or password incorrect", username: username, password: password});
                }
            }else{
                res.render("login", {errMsg: "Email or password incorrect", username: username, password: password});
            }
        }
    })
})

app.listen(3000 ,() =>{
    console.log(`Server is start on localhost: 3000`)
})
    