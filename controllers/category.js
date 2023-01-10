const Category = require("../models/Category")
const { validationResult } = require("express-validator")

//getCategory middeleware by user id
exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).select("name").then((category) => {
        if (!category) {
            return res.status(404).json({ errormsg: "category not Found" })
        }
        req.category = category
        next()
    }).catch((error) => {
        return res.status(500).json({ errormsg: "category not Found" })
    })
}
//Createcategory this action is only for ADMIN previlages 
exports.Createcategory = (req, res) => {
    let category = new Category(req.body)
    category.save((err, category) => {
        if (!category || err) {
            return res.status(404).json({ errormsg: "Cannot save category to DB" })
        }
        res.json(category)
    })
}
exports.getCategory = (req, res) => {
    return res.json(req.category)
}

exports.getAllcategory = (req, res) => {
    Category.find({}).then((catrogries) => {
        return res.json(catrogries)
    }).catch((error) => {
        return res.status(404).json({ errormsg: "categories are not availabel" })
    })
}

exports.updatecategory = (req, res) => {
    let category = req.category
    console.log(req.body);
    category.name = req.body.name
    category.save((err, updatedcategory) => {
        if (err || !updatedcategory) {
            return res.status(400).json({ errormsg: "Failed to update catrgory" })
        }
        res.status(200).json(updatedcategory)
    })
}


exports.deletecategory = (req, res) => {
    let category = req.category
    category.remove((err, deletedcategory) => {
        if (err || !deletedcategory) {
            return res.status(400).json({ errormsg: "Failed to delete catrgory" })
        }
        res.status(200).json(deletedcategory)
    })
}