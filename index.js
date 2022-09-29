const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken")
require('dotenv').config()
const authorize = require("./authorization.js");
const { Knex } = require("knex");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const port = process.env.PORT

const app = express();

const knex = require('knex')(require('./knexfile'));

app.use(express.json())

app.use(cors());

app.get("/", (req,res)=>{
  res.send("success")
})

app.patch("/edit/amt", authorize, async (req,res)=>{
   await knex
    .update("amount", req.body.amount)
    .from("meds")
    .where("meds.id", "=", req.headers.id)

})

app.patch("/edit", authorize, async (req,res)=>{
   await knex
    .from("meds")
    .where("meds.id", "=", req.headers.id)
    .update("amount", req.body.amount)
    .update("med_name", req.body.med_name)
    .update("dosage", req.body.dosage)
    .update("time_interval", req.body.time_interval)
    
})

app.delete("/delete/med", authorize, async (req, res) =>{
   await knex
    .delete("*")
    .from("meds")
    .where("meds.id", "=", req.headers.id)
    res.send("success")
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
    .from("log")
    .where("log.user_id", "=", req.user_id)
    res.send(log)
})

app.post("/add", authorize, async (req,res)=>{
  await knex
    .select("*")
    .from("meds")
    .insert({
      med_name: req.body.name,
      amount: req.body.amount,
      user_id: req.user_id,
      dosage: req.body.dosage,
      time_interval: req.body.time_interval


    })
    res.send("success")
  
})

app.post("/log/post", authorize, async (req,res)=>{
  await knex 
    .select("*")
    .from("log")
    .insert({
      user_id: req.user_id,
      med_id: req.body.medid,
      comment: req.body.comment,
      ifTaken: true,
      med_name: req.body.med_name,
      dosage: req.body.dosage
    })
    res.send("success")
    
})

app.post("/register", async (req,res)=>{
  const myPlaintextPassword = req.body.password
  bcrypt.hash(myPlaintextPassword, saltRounds)
    .then (async function(hash) {
    try { await knex
    .select("*")
    .from("user")
    .insert({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: hash,
      email: req.body.email
  })} catch (error) {
    console.log(error)
  }
  res.send("success")
    })

    
})

app.post("/login", async (req,res)=>{
   try { await knex
    .select("*")
    .from("user")
    .where("email", "=", req.body.email)
    .then ((data)=>{
      if (data === []) {
        res.send("failure to login")
        return
      }
      let username = req.body.email
      let password = req.body.password
      let user_id = data[0].id
      if ((bcrypt.compareSync(password, data[0].password)) || (password === data[0].password)) {
        let token = jwt.sign({user_id:user_id}, process.env.SECRET)
        res.json({token:token, data})
      } else {
        res.send("failure to autheticate")
      }
    })} catch (error){
      res.send(error)
    }
})

app.listen(port, () => {
    console.log(`I'm here and I'm listening on port ${port}`);
  });