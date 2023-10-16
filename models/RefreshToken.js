const mongoose = require("mongoose");
const User = require("./User");
const uuidv4=require("uuid").v4;
const Schema=mongoose.Schema
const refreshTokenSchema=new Schema({
    token:String,
    user:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    expiryDate:Date
},{
    timestamps:true
})
refreshTokenSchema.statics.generateToken=async function(user){
    
    let expiredDate=new Date();
    expiredDate.setSeconds(expiredDate.getSeconds()+86400);
    let _token=uuidv4();
    let _object=new this({
        token:_token,
        user:user._id,
        expiryDate:expiredDate
    })
    let refreshToken=await _object.save();
    return refreshToken.token;
}
refreshTokenSchema.statics.verifyExpiry=function(token){
    // console.log(token.expiryDate.getTime(), new Date().getTime())
    return token.expiryDate.getTime() < new Date().getTime();
}
module.exports=mongoose.model("RefreshToken",refreshTokenSchema);