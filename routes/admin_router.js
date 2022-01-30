const express=require("express")
const router=express.Router()
const User=require("../models/User")
const Workout=require("../models/Workout")
const authAdmin=require("../middleware/auth_admin")
const authAdminAndUserManager=require("../middleware/auth_admin_and_user_manager")
router.get("/users",authAdminAndUserManager,async function(req,res){
    try{
        const users=await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send(e)
    }
})

router.put("/users/:id",authAdminAndUserManager,async function(req,res){
    const updates=Object.keys(req.body)
    const allowedUpdates=["name","email","password"];
    const isValidUpdate=updates.every(update=>allowedUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(400).send({"error":"Invalid update"})
    }
    try{
      
    const updatedUser=await User.findById(req.params.id)
    if(!updatedUser){
        return res.status(404).send({error:"User is not found"})
    }
    updates.forEach(update=>{
        updatedUser[update]=req.body[update]
    })
    console.log(updatedUser)
      await  updatedUser.save()
    
     res.send(updatedUser)
    }catch(e){
        res.status(500).send(e)
    }
})
router.delete("/users/:id",authAdminAndUserManager,async function(req,res){
    try{
        await User.deleteOne({_id:req.params.id})
        res.status(200).send({message:"This user has been deleted successfully"})
    } catch(e){
       res.status(500).send({error:"Internal server error"})
    }
    
})
router.get("/workouts",authAdmin,async function(req,res){
    try{
    const workouts=await Workout.find({})
     res.status(200).send(workouts)
    }catch(e){
     res.status(500).send({error:e})
    }
})
router.put("/workouts/:id",authAdmin,async function(req,res){
    console.log(req.body);
    
    const updates=Object.keys(req.body)
    const allowedUpdates=["time","distance"];
    const isValidUpdate=updates.every(update=> {
        return allowedUpdates.includes(update)})
    if(!isValidUpdate){
       return res.status(400).send({error:"Unallowed update"})
    }
    try{
    const updatedWorkout=await Workout.findById(req.params.id)
     console.log(updatedWorkout)
  
     updates.forEach(update=>{
       updatedWorkout[update]=req.body[update]
    })
    console.log(updatedWorkout)
  await updatedWorkout.save()
  if(!updatedWorkout){
    return res.status(404).send({error:"Workout is not found"})
 }
   res.send(updatedWorkout)
    }catch(e){
      res.status(500).send({error:"Internal server error"})
    }
})
router.delete("/workouts/:id",authAdmin,async function(req,res){
    try{
    const deletedWorkout=await Workout.deleteOne({_id:req.params.id})
     res.send({message:"This record has been deleted successfully"})
    }catch(e){
        res.status(500).send({error:e})
    }
})

module.exports=router