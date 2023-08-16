require('dotenv').config()
const express =require("express");
const mongoose = require("mongoose");
const {Schema}=mongoose;
const cors = require("cors");
const path = require('path');


const app = express();
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use(express.static((path.join(__dirname, "./dist"))))
const port =process.env.PORT || 3000 ;


//mongoose chat-gpt connection
async function main() {
    // Replace this connection string with the one from your MongoDB Atlas cluster
    const atlasConnectionString =process.env.MONGO_URL;

    await mongoose.connect(atlasConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log('DB connected To Atlas successfully');
}

main().catch(err => console.log(err));



////////////////////////////////////////////////////////////
// mongoose.connect('mongodb://127.0.0.1:27017/myLoginRegisterDB',{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
   
// }).then(console.log("Db connected successfully"));

////////////////////////////////////////////////////////////

// main().catch(err => console.log(err));
// async function main() {
// await mongoose.connect('mongodb://127.0.0.1:27017/myLoginRegisterDB');
// console.log('DB connected sucessfully')
//   }

const userSchema =mongoose.Schema({
   name:{type:String},
   email:{type:String,unique: true },
   password:{type:String},
   phoneNumber:{type:Number},
   skills:{type:String},
   courseName:{type:String},
   company:{type:String},
   institute:{type:String},
   duration:{type:String},
   position:{type:String},
   college:{type:String},
   course:{type:String},
   year:{type:String},
   bio:{type:String},})

const User =mongoose.model("User",userSchema);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});

//routes
app.post("/login",(req,res)=>{
const {email,password,}=req.body;
User.findOne({email:email})
.then((user)=>{
if(user){
if(password===user.password){
  res.send({message:"Login successfull ",user:user})
}else{
  res.send({message:"password didnt match"})
}
}else{
res.send({message:"User not found please register first"})
}

})

});
app.post("/register",(req,res)=>{
  const {name,email,password,phoneNumber,skills,courseName,institute,company,duration,position,college,course,year, bio,} =req.body;
  User.findOne({email:email})
  .then((user)=>{
if(user){
  res.send({message:"User already registered"})
  console.log("already exist")
}else{
  const user = new User({
name,email,password,phoneNumber,skills,courseName,institute,company,duration,position,college,course,year, bio,});

  user.save()
  .then(()=>{
    res.send({message:"Successfully Registered ,please login Now !!"})
    })
    .catch((err)=>{
      res.send(err);
    });
}
  })
  .catch((err)=>{
    res.send(err);  
  });
});
app.listen(port,()=>{
    console.log(`Server Connected successfully with port :${port}`)
})