const express=require("express")
const router=express.Router()
const User=require("../models/User")
const auth=require("../middleware/auth")

router.post("/users/login",async function(req,res){
    //try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateToken()
        
        res.status(200).send({user,token})
    // }catch(e){
    //   res.status(400).send({error:'Unable to login'})
    // }
  
})
router.post("/users/signup", async function(req,res){
    const user=new User(req.body)
    try{
      await user.save()
      const token=await user.generateToken()
      res.status(201).send({user,token})

    }catch(e){
      res.status(500).send({error:e})
    }
})
router.get("/users/me",auth,function(req,res){
    
    res.status(200).send(req.user)
  })
router.patch("/users/me",auth,async function(req,res){
    const updates=Object.keys(req.body)
    const allowedUpdates=["name","email","password"];
    const isValidUpdate=updates.every(update=>allowedUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(400).send({"error":"Invalid update"})
    }
    try{
    
    updates.forEach(update=>{
        return req.user[update]=req.body[update]
    })
      await  req.user.save()
     res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})
router.delete("/users/me",auth,async function(req,res){
  try{
    await req.user.remove()
    res.send({message:"This user has been deleted successfully"})
  }catch(e){
    res.status(500).send({message:"Internal server error"})
  }
})

router.post("/users/logout",auth,async function(req,res){
    try{
    req.user.tokens= req.user.tokens.filter(token=>{
         return token.token!==req.token
     })
     await req.user.save()
     res.status(200).send({message:"You are logged out "})
    }catch(e){
        res.status(500).send({error:"Internal server error"})
    }
})
module.exports=router