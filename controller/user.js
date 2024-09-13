const User =require("../models/user");

module.exports.renderSignInform = (req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.userSignIn = async (req,res)=>{
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
 }

 module.exports.renderLogInForm = (req,res)=>{
    res.render("users/login.ejs");
 }

module.exports.userLogIn = async(req,res)=>{
    req.flash("success","welcome back to wanderlust!")
    
   //  console.log(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl); 
 }

 module.exports.userLogout = (req,res)=>{
    req.logOut((err)=>{
       if(err){
          return next(err);
       }
       req.flash("success","you are logged out !")
       res.redirect("/listings");
    });
    
 }