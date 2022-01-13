var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')

let secModel = require('./security.model')

let init = async ()=>{
    await secModel.initModel()
}
init()

//SignUp route
router.post('/',async (req,res) => {
    try {
        var result = await secModel.signUp(req.body)
        const message = result.Success === false ? {"Message": "User already exist, please Log in instead."} : result
        res.status(200).json(message)
    }catch(error){
        res.status(500).json({"ERROR":"Something went wrong creating your account"})
    }
})


//Sign In Route
router.post('/signin', async(req,res)=>{
    try{
        var {email, password} = req.body
        var user = await secModel.getByEmail(email)
        if(await secModel.comparePassword(password, user.password)){
            const { _id, name, email, password} = user
            const jUser = {_id, name, email, password}            
            let token = jwt.sign(jUser, process.env.JWT_SECRET, {expiresIn:"120m"})            
            res.status(200).json({...jUser, jwt:token})                
        }else{
            res.status(401).json({"ERROR":"Email or password are incorrect"})
        }
    }catch(error){
        res.status(500).json({"ERROR":"Something went wrong"})
    }
})

router.get('/userInfo/:userid', async (req,res)=>{
    try {
        let {userid} = req.params
        let user = await secModel.userInfo(userid)
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({"ERROR":"Unable to find user"})
    }
})


module.exports = router