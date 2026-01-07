const category_model = require("../models/category.model")
exports.createNEwCategory = async(req, res)=>{
    //read the request body
   

    //create the category obj
     const category_data = {
        name : req.body.name,
        description : req.body.description
    }

    // insert into mongDb
    try {
        const category = await category_model.create(category_data)
        return res.status(201).send(category)
    } catch (err) {
        console.log("error while creating the category",err)
        return res.status(500).send({
            message : "error while creating the category"
        })
    }
    

    //return the response of the created category
}