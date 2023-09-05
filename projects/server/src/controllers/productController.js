const sequelize = require('sequelize');
const model = require('../models');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    list: async (req, res, next) => {
        try {
            let {
                page,
                size,
                name,
                sortby,
                order
            } = req.query;

            if (!page) {
                page = 0;
            }
            if (!size) {
                size = 10;
            }
            if(!sortby) {
                sortby = 'name';
            }
            if (!order) {
                order = 'ASC';
            }
            if (!name) {
                name= '';
            }

            let getProduct = await model.product.findAndCountAll({
                attributes: ['uuid', 'name', 'product_image', 'price', 'stock', 'category_id', 'isDeleted'],
                where: {
                    name:{[sequelize.Op.like]: `%${name}%`}
                },
                include:[
                    {
                        model: model.category,
                        attributes: ['category'],
                        where: {
                            isDeleted: {
                                [sequelize.Op.in]: [false]
                            }
                        }
                    }
                ],
                offset: parseInt(page * size),
                limit: parseInt(size),
                order: [[sortby, order]]
            });

            return res.status(200).send({
                data: getProduct.rows,
                totalPage: Math.ceil(getProduct.count / size),
                datanum: getProduct.count
            })
            
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}