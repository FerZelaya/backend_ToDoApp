const ObjectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const UserController = require('../../../schemas/UserSchemas')

let usersColl;

module.exports = class {

    static async initModel(){
        mongoose.connect(process.env.MONGODBURI, () => {
            usersColl = true
        })
    }

    //User Info
    static async userInfo(userid){
        try{
            let filter = { "_id": new ObjectId(userid)};
            const result = await UserController.findOne(filter);
            return result;
        }catch(error){
            console.log(error);
            return error
        }
    }

    //Sign Up
    static async signUp(data){
        const {name, email, password } = data
        const accountExist = await this.getByEmail(email)
        const user = new UserController({
            name: name,
            email: email,
            password: bcrypt.hashSync(password,10),
            roles: ["public"]
        })
        try {
            var result
            if(accountExist){
                result = {"Success": false}
                return result
            } else {
                result = await user.save()
                return result.name && {"Success": true} 
            }
        } catch(error){
            console.log(error);
            return error
        }
    }


    //Get user by email
    static async getByEmail(email){
        try{
            let filter = {"email": email}
            let user = await UserController.findOne(filter)
            return user 
        }catch(error){
            console.log(error);
            return error
        }
    }

    //Compare Password
    static async comparePassword( rawPassword, cryptedPassword) {
        try{
            return bcrypt.compareSync(rawPassword,cryptedPassword)
        }catch(error){
            return false
        }
    }


}