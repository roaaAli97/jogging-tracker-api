const jwt=require("jsonwebtoken")
const User=require("../models/User")
const authAdmin=async (req,res,next)=>{
    try{
      const token=req.header("Authorization").replace("Bearer ","")
      const decoded=jwt.verify(token,"Ilovejavascript")
      const role=decoded.role
      if(role=="admin"){
          next()
      }
      else{
          throw new Error
      }
    }catch(e){
        res.status(401).send({message:"Please authenticate"})
    }
}
module.exports=authAdmin