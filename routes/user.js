const express=require("express");
const router = express.Router();
const User =require("../models/user");
const asyncWrap = require("../utils/asyncWrap");
router.get("/signup",(req,res)=>{
   res.render("users/signup.ejs");
})
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
// const { saveRedirectUrl } = require("../middleware.js");
router.post("/signup",asyncWrap( async (req,res)=>{
   try{
      let {username,email,password}=req.body;
      let newuser = new User({email,username});
      let registeredUser = await User.register(newuser,password);
      console.log(registeredUser);
      req.login(registeredUser,(err)=>{
         if(err){
            return next(err);
         }
         req.flash("success","Welcome to Wanderlust")
         res.redirect("/listings");
      })
   }catch(e){
      req.flash("error",e.message);
      res.redirect("/signup");
   }
}))
router.get("/login",(req,res)=>{
   res.render("users/login.ejs");
})

router.post("/login",saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
   req.flash("success","welcome back to wanderlust!")
   
   console.log(res.locals.redirectUrl);
   let redirectUrl = res.locals.redirectUrl ||"/listings";
   res.redirect(redirectUrl); 
}
);
 
router.get("/logout",(req,res)=>{
   req.logOut((err)=>{
      if(err){
         return next(err);
      }
      req.flash("success","you are logged out !")
      res.redirect("/listings");
   });
   
});
module.exports=router; 