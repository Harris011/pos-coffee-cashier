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
        }
    }
}