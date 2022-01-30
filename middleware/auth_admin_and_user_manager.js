const jwt=require("jsonwebtoken")
const authAdminAndUserManager=async (req,res,next)=>{
    try{
        const token=req.header("Authorization").replace("Bearer ","")
        const decoded= jwt.verify(token,"Ilovejavascript")
        const role=decoded.role
        if(role==="admin"||role==="user manager"){
            next()
        }
        else{
            throw new Error
        }
     
    }catch(e){
        res.send({message:"Please authenticate"})
    }
   
}

module.exports =authAdminAndUserManager