const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const Workout=require("./Workout")
const UserSchema=mongoose.Schema({
    
        name:{
            type:String
        },
        email:{
            type:String,
            lowercase:true,
            trim:true,
            unique:true,
            required:true
    
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            default:"user"
        },
        tokens:[
            {
                token:{
                    type:String,
                    required:true
                }
            }
        ]
})
UserSchema.virtual("workouts",{
    ref:"Workout",
    localField:"_id",
    foreignField:"owner"
})
UserSchema.methods.generateToken=async function(){
   const user=this
   const token=jwt.sign({_id:user._id,role:user.role},"Ilovejavascript")
   user.tokens=user.tokens.concat({token})
   await user.save()
   return token
}
UserSchema.statics.findByCredentials=async (email,password)=>{
   const user=await User.findOne({email});
   console.log(user)
   if(!user){
       throw new Error("unable to login")
   }
   const isMatch=await bcrypt.compare(password,user.password)
   if(!isMatch){
       throw new Error("unable to login");
   }
   console.log(isMatch)
   return user;
}
UserSchema.pre("save",async function(next){
  const user=this
  if(user.isModified("password")){
    user.password=await bcrypt.hash(user.password,8)
  }
  
  next()
})
UserSchema.pre("remove",async function(next){
    const user=this
    await Workout.deleteMany({owner:user._id})
    next()
})
const User=mongoose.model('User',UserSchema)
module.exports=User;