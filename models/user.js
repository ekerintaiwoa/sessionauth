const mongoose = require("mongoose") ;
// extract schema out of the mongoose class
const Schema = mongoose.Schema

const userSchema = new Schema({

   userName : {
      type:String ,
      required:true

   } ,

   email: {
     required: true ,
     type: String ,
     unique: true

   } ,
   password: {
   
    type : String ,
    required : true 

   }



})


module.exports = mongoose.model("user" ,userSchema) 


