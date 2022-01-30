const express=require("express")
const router=express.Router();
const Workout=require("../models/Workout")
const auth=require("../middleware/auth")
router.post("/new-workout",auth,async function(req,res){
   // try{
        const newWorkout=new Workout({
            ...req.body,
            owner:req.user._id
        } ) 
        await newWorkout.save()
        res.send(newWorkout)
    // } catch(e){
    //   res.status(500).send({error:"Internal serve error"})
    // }
    
 
})
router.get("/workouts",auth,async function(req,res){
    try{
     const filterByDate={}
     const match={}
     console.log(req.query.start)
     if(req.query.start){
         //format start=2021-1-12:to=2021-2-1
         const partOne=req.query.start.split(":")
         const fromDate=partOne[0]
         let partTwo=partOne[1]
          const partThree=partTwo.split("=")
          const toDate=partThree[1]
          filterByDate.fromDate=new Date(fromDate),
          filterByDate.toDate= new Date(toDate)
          const workouts=await Workout.find({owner:req.user._id,date:{$gt:filterByDate.fromDate,$lte:filterByDate.toDate}})
          return res.status(200).send(workouts)
     }
     
    
      await req.user.populate("workouts")
     res.status(200).send(req.user.workouts)
    }catch(e){
     res.status(500).send({error:e})
    }
})
router.put("/workouts/:id",auth,async function(req,res){
    
    const updates=Object.keys(req.body)
    const allowedUpdates=["time","distance"];
    const isValidUpdate=updates.every(update=> {
        return allowedUpdates.includes(update)})
    if(!isValidUpdate){
       return res.status(400).send({error:"Unallowed update"})
    }
    try{
        const updatedWorkout=await Workout.findOne({_id:req.params.id,owner:req.user._id})
     
        if(!updatedWorkout){
           return res.status(404).send({error:"Workout is not found"})
        }
        updates.forEach(update=>{
          updatedWorkout[update]=req.body[update]
       })
       
          await updatedWorkout.save()
     
          res.send(updatedWorkout)
    }catch(e){
      res.status(500).send({error:"Internal server error"})
    }
    
    
})
router.delete("/workouts/:id",auth,async function(req,res){
    try{
    const deletedWorkout=await Workout.findOneAndDelete({_id:req.params.id,owner:req.user._id})
     res.send({message:"This record has been deleted successfully",deletedWorkout})
    }catch(e){
        res.status(500).send({error:e})
    }
})
router.get("/average-speed/me",auth,async function(req,res){
   await req.user.populate("workouts")
   const workouts=req.user.workouts
   let totalDistance=0
   let totalTime=0
   workouts.forEach(workout=>{
       totalDistance+=workout.distance
       totalTime+=workout.time
   })
       const speed=totalDistance/totalTime;
   res.send({"total-distance(km)":totalDistance,"speed (km/hr)":speed})
})

module.exports=router;