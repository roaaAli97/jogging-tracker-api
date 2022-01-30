const express=require("express")
const app=express()
require("./db/mongoose")
const joggingTrackerRouter=require("./routes/workout_router")
const userRouter=require("./routes/user_router")
const adminRouter=require("./routes/admin_router")
app.use(express.json())
app.use(joggingTrackerRouter)
app.use(userRouter)
app.use(adminRouter)

    app.listen(3000,function(){
        console.log("server is running on port 3000")
    })