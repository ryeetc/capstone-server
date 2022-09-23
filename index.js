const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken")
require('dotenv').config()
const authorize = require("./authorization.js")

const port = process.env.PORT

const app = express();

const knex = require('knex')(require('./knexfile'));

app.use(express.json())

app.use(cors());

app.get("/", authorize, (req,res)=>{
  knex('user')
    .then((data) => {
      res.send(data);
    })
    .catch((err) =>
      res.send(err)
    );
})

app.get("/meds", authorize, async (req,res)=>{
  const meds = await knex
    .select("*")
    .from("user")
    .join("meds", "user.id", "meds.user_id")
    .where("user.id", "=", req.user_id)
    res.send(meds)
})

app.get("/log", authorize, async (req,res)=>{
  const log = await knex
    .select("*")
    .from("user")
    .join("log", "user.id", "log.user_id")
    .where("user.id", "=", req.user_id)
    res.send(log)
})

app.post("/add", authorize, async (req,res)=>{
  const addMed = await knex
    .select("*")
    .from("meds")
    .insert({
      med_name: req.body.name,
      amount: req.body.amount,
      user_id: req.user_id,
      dosage: req.body.dosage,
      interval: req.body.interval

    })
    res.send("success")
})

app.post("/log/post", authorize, async (req,res)=>{
  const addlog = await knex 
    .select("*")
    .from("log")
    .insert({
      user_id: req.user_id,
      med_id: req.params.medid,
      comment: req.body.comment,
      ifTaken: true
    })
    
})

app.post("/register", async (req,res)=>{
  const addUser = await knex
    .select("*")
    .from("user")
    .insert({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      password: req.body.password,
      email: req.body.email
    })
    res.send("success")
})

app.post("/login", async (req,res)=>{
  const person = await knex
    .select("*")
    .from("user")
    .where("email", "=", req.body.email)
    .then ((data)=>{
      let username = req.body.email
      let password = req.body.password
      let user_id = data[0].id
      if (data[0].password === password) {
        let token = jwt.sign({user_id:user_id}, process.env.SECRET)
        res.json({token:token, data})
      } else {
        res.send("failure to autheticate")
      }
    })
})

app.listen(port, () => {
    console.log(`I'm here and I'm listening on port ${port}`);
  });