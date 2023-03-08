const profile = require("../Model/model");
const router = require("express").Router();
const CryptoJS=require("crypto-js");
const jwt =require("jsonwebtoken");
const {
    verifyTokenAndAuthorization
  } = require("./auth");
  const cloudinary = require("cloudinary").v2;
  const multer = require("multer")
  const path = require('path');
  const { stringify } = require("querystring");
  cloudinary.config({
      cloud_name: "dtzlqivcd",
      api_key: "789299334293845",
      api_secret: "RJmv1_ijO6xYuHKaRZDnPqlB6-w"
  
  })
  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, './filefolder')
      },
      filename: (req, file, cb) => {
          cb(null, file.originalname)
      }
  })
  
  
  const upload = multer({ storage: storage });
  async function uploadToCloudinary(filePath) {
      let filePathToCloudinary = filePath
      return cloudinary.uploader.upload(filePath, { "photo": filePathToCloudinary })
          .then((result) => {
              return {
                  message: "succcess",
                  url: result.url
              }
          }).catch((err) => {
              return {
                  message: "failed",
  
              }
          })
  }
  
  
//completed
router.post('/profile/create',upload.single('photo'),async(req,res)=>{

    let localpath = req.file.path.replace(/\\/g, "/")
    try{
        let result = await uploadToCloudinary(localpath);
        console.log(result)

        const newProfile = new profile({

            username:req.body.username,
            email: req.body.email,
            password:CryptoJS.AES.encrypt(
                req.body.password,
                "passsec"
              ).toString(),
            image:`${result.url}`,
            desc: req.body.desc,

        });

        const newProfile1 = await newProfile.save();
        res.status(200).json(newProfile1);
    }
    catch{
        res.json({"err":"something went wrong"})
    }
})
//completed
router.get('/profiles',verifyTokenAndAuthorization,async(req,res)=>{

    try {
        const pro1 = await profile.find();
        res.status(200).json(pro1);
      } catch (err) {
        res.status(500).json(err);
      }

})

//completed
router.get('/profile',verifyTokenAndAuthorization,async(req,res)=>{
    try {
        const pro = await profile.findById(req.query.userid);
        res.status(200).json(pro);
      } catch (err) {
        res.status(500).json(err);
      }
})


//completed
router.post('/login',async(req,res)=>{

    try {
        const Profile = await profile.findOne({ username: req.body.username });
        !Profile && res.status(401).json("Wrong credentials!");
    
        const hashedPassword = CryptoJS.AES.decrypt(
          Profile.password,
          "passsec"
        );
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    
        OriginalPassword !== req.body.password &&
          res.status(401).json("Wrong credentials!");
    
        const accessToken = jwt.sign(
          {
            id: Profile._id,
            
          },
          'jwtkey',
          {expiresIn:"7d"}
        );
    
        const { password, ...others } = Profile._doc;
    
        res.status(200).json({...others, accessToken});
      } catch (err) {
        res.status(500).json(err);
      }
   

})
//completed
router.put('/profile',verifyTokenAndAuthorization,async(req,res)=>{
    try {
        const updatedProfile = await profile.findByIdAndUpdate(
            req.query.userid, {
                $set: req.body,
            }, { new: true }
        );
        res.status(200).json(updatedProfile);
    } catch (err) {
        res.status(500).json(err);
    }
})
//completed
router.delete('/profile',verifyTokenAndAuthorization,async(req,res)=>{
    try {
        await profile.findByIdAndDelete(req.query.id);
        res.status(200).json("Profile has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports=router