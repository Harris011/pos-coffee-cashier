const sequelize = require('sequelize');
const model = require('../models');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    list: async (req, res, next) => {
        try {
            let {
                page,
                size,
                sortby,
                order,
                category,
            } = req.query

            if (!page) {
                page = 0;
            }
            if (!size) {
                size = 10;
            }
            if(!sortby) {
                sortby = 'category';
            }
            if (!order) {
                order = 'ASC';
            }
            if (!category) {
                category= '';
            }
            
            let getCategory = await model.category.findAndCountAll({
                attibutes: ['id', 'category', 'isDeleted'],
                where: {
                    category:{[sequelize.Op.like]: `%${category}%`}
                },
                offset: parseInt(page * size),
                limit: parseInt(size),
                order: [[sortby, order]]
            });

            return res.status(200).send({
                data: getCategory.rows,
                totalPage: Math.ceil(getCategory.count / size),
                datanum: getCategory.count
            });

        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            let checkCategory = await model.category.findAll({
                where: {
                    category: req.body.category
                }
            });
            if(checkCategory.length == 0) {
                const {category} = req.body;
                const create = await model.category.create({
                    category,
                    isDeleted: false
                });

                return res.status(200).send({
                    success: true,
                    message: 'Create new category success'
                })
                
            } else {
                res.status(400).send({
                    success: false,
                    message: 'Category with the same name already exists'
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    edit: async (req, res, next) => {
        try {
            const {category} = req.body;
            const {id} = req.params;

            let exists = await model.category.findAll({
                where: {id}
            });

            if (exists.length > 0) {
                const checkCategory = await model.category.findAll({
                    where: {
                        category,
                        id: {[sequelize.Op.ne]: id}
                    }
                })

                if (checkCategory.length == 0) {
                    let edit = await model.category.update({
                        category
                    }, {
                        where: {id}
                    })
        
                    res.status(200).send({
                        success: true,
                        message: 'Category change success',
                        data: edit
                    })
                } else {
                    res.status(400).send({
                        success: false,
                        message: 'Category name already exists. changes canceled'
                    })
                }
            } else {
                res.status(404).send({
                    success: false,
                    message: 'Category not found'
                })
            }

        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    drop: async (req, res, next) => {
        try {
            let checkCategory = await model.category.findAll({
                where: {
                    id: req.params.id
                }
            })

            if (checkCategory[0].dataValues.isDeleted == false) {
                await model.category.update({isDeleted: 1}, {
                    where: {
                        id: req.params.id
                    }
                })
                
                return res.status(200).send({
                    success: false,
                    message: 'This category is now inactive'
                })
            } else {
                await model.category.update({isDeleted: 0}, {
                    where: {
                        id: req.params.id
                    }
                })

                return res.status(200).send({
                    success: true,
                    message: 'This category is now active'
                })
            }

        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    categoryList: async (req, res, next) => {
        try {
            let {
                page,
                size,
                sortby,
                order,
                category,
            } = req.query

            if (!page) {
                page = 0;
            }
            if (!size) {
                size = 10;
            }
            if(!sortby) {
                sortby = 'category';
            }
            if (!order) {
                order = 'ASC';
            }
            if (!category) {
                category= '';
            }
            
            let getCategory = await model.category.findAndCountAll({
                attibutes: ['id', 'category', 'isDeleted'],
                where: {
                    category:{[sequelize.Op.like]: `%${category}%`},
                    isDeleted: false
                },
                offset: parseInt(page * size),
                limit: parseInt(size),
                order: [[sortby, order]]
            });

            return res.status(200).send({
                data: getCategory.rows,
                totalPage: Math.ceil(getCategory.count / size),
                datanum: getCategory.count
            });

        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}