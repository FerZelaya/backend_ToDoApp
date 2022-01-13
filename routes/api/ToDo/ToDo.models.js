const mongoose = require("mongoose")
const ObjectId = require('mongodb').ObjectId
const ToDoController = require('../../../schemas/ToDosSchema')


var todoColl = false;

module.exports = class {
    //initmodel
    static async initModel(){
        try {
            // Connect to the MongoDB cluster
            mongoose.connect(
              process.env.MONGODBURI,
              { useNewUrlParser: true, useUnifiedTopology: true },
              () => {todoColl = true}
            );
        
        } catch (e) {
            console.log("could not connect");
        }
    }

    //Show all ToDos
    static async showAllUserToDos(userID){
        try{
            if(todoColl){
                const filter = {"userID": userID}
                let ToDos = await ToDoController.find(filter)
                return ToDos
            }
            return[]
        }catch(error){
            console.log(error);
            return error
        }
    }

    //Post a To Do
    static async postToDo(title, description, priority, completed, date, userID){
        const todo = new ToDoController({
            title: title,
            description: description,
            priority: priority,
            completed: completed,
            date: date,
            userID: ObjectId(userID)
        })
        try {
            const savedToDo = await todo.save();
            return savedToDo;
        } catch(error){
            console.log(error);
            return error
        }

    }

    //update a to do
    static async updateToDo(title, description, priority, completed, date, ToDoID){
        try {
            const updatedToDo = await ToDoController.updateOne(
                {_id: ToDoID},
                {$set: 
                    {
                        title: title,
                        description: description,
                        priority: priority,
                        completed: completed,
                        date: date
                    }
                }
            );
            return updatedToDo;
        } catch(error){
            console.log(error);
            return error
        }

    }

    static async updateCompleted(completed, ToDoID){
        try {
            const updatedToDo = await ToDoController.updateOne(
                {_id: ToDoID},
                {$set: 
                    {
                        completed: completed
                    }
                }
            );
            return updatedToDo;
        } catch(error){
            console.log(error);
            return error
        }
    }

    //update a to do
    static async deleteToDo(ToDoID){
        try {
            const filter = {_id: ToDoID}
            const deletedToDo = await ToDoController.deleteOne(filter)
            return deletedToDo;
        } catch(error){
            console.log(error);
            return error
        }

    }
}
