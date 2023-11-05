const sequelize = require('sequelize');
const model = require('../models');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { join } = require('path');

function formatCurrency(price) {
    return price.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });
}

module.exports = {
    list: async (req, res, next) => {
        try {
            let {
                page,
                size,
                name,
                sortby,
                order,
                category
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
            if (!category) {
                category= '';
            }

            let getProduct = await model.product.findAndCountAll({
                attributes: ['uuid', 'name', 'product_image', 'price', 'stock', 'category_id', 'isDeleted'],
                where: {
                    name:{[sequelize.Op.like]: `%${name}%`},
                    '$category.category$': { [sequelize.Op.like]: `%${category}%` }
                },
                include:[
                    {
                        model: model.category,
                        attributes: ['id','category'],
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
    },
    create: async (req, res, next) => {
        const ormTransaction = await model.sequelize.transaction();
        try {
            let checkProduct = await model.product.findAll({
                where: {
                    name: JSON.parse(req.body.data).name
                }
            });

            if (checkProduct.length == 0) {
                const {
                    name,
                    price,
                    stock,
                    category_id
                } = JSON.parse(req.body.data);

                if (!req.files || req.files.length === 0) {
                    return res.status(400).send({
                        success: false,
                        message: 'No image file uploaded'
                    })
                } else {
                    const create = await model.product.create({
                        uuid: uuidv4(),
                        name,
                        product_image: `/imgProduct/${req.files[0]?.filename}`,
                        price,
                        stock,
                        category_id,
                        isDeleted: false
                    });
                    await ormTransaction.commit();
                    return res.status(200).send({
                        success: true,
                        message: 'Create new product success'
                    })
                }
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Product with the same name already exists'
                })
            }
        } catch (error) {
            await ormTransaction.rollback();
            console.log(error);
            next(error);
        }
    },
    edit: async (req, res, next) => {
        try {
            let checkProduct = await model.product.findAll({
                where: {
                    name: JSON.parse(req.body.data).name,
                    uuid: {[sequelize.Op.ne]:req.params.uuid}
                }
            });

            if (checkProduct.length == 0) {
                const {
                    name,
                    price,
                    stock,
                    category_id
                } = JSON.parse(req.body.data);

                const product = await model.product.findOne({
                    where: {
                        uuid: req.params.uuid
                    }
                });

                if (!product) {
                    return res.status(404).send({
                        success: false,
                        message: 'Product not found'
                    })
                }

                const oldImage = product.product_image;

                let newImage = oldImage

                if (req.files.length > 0) {
                    newImage = `/imgProduct/${req.files[0]?.filename}`
                }

                let updateProduct = await model.product.update({
                    name,
                    product_image: newImage,
                    price,
                    stock,
                    category_id
                }, {
                    where: {
                        uuid: req.params.uuid
                    }
                })

                if (updateProduct == 1) {
                    res.status(200).send({
                        success: true,
                        message: 'Product change success',
                        data: updateProduct
                    })
                } else {
                    res.status(200).send({
                        success: true,
                        message: 'No Product information changed',
                        data: updateProduct
                    })
                }

                if (oldImage !== newImage) {
                    if (fs.existsSync(join(__dirname, `../public${oldImage}`)) && !oldImage.includes('default') ) {
                        fs.unlinkSync(join(__dirname, `../public${oldImage}`));
                    }
                }

            } else {
                res.status(400).send({
                    success: false,
                    message: 'Product name already exists. changes canceled'
                })
            }

        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    drop: async (req, res, next) => {
        try {
            let checkProduct = await model.product.findAll({
                where: {
                    uuid: req.params.uuid
                }
            })

            if (checkProduct[0].dataValues.isDeleted == false) {
                await model.product.update({isDeleted: 1}, {
                    where: {
                        uuid: req.params.uuid
                    }
                })

                return res.status(200).send({
                    success: true,
                    message: 'This product is now inactive'
                })

            } else {
                await model.product.update({isDeleted: 0}, {
                    where: {
                        uuid: req.params.uuid
                    }
                })

                return res.status(200).send({
                    success: true,
                    message: 'This product is now active'
                })
            }

        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    productList: async (req, res, next) => {
        try {
            let {
                page,
                size,
                name,
                sortby,
                order,
                category
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
            if (!category) {
                category= '';
            }

            let getProduct = await model.product.findAndCountAll({
                attributes: ['uuid', 'name', 'product_image', 'price', 'stock', 'category_id', 'isDeleted'],
                where: {
                    name:{[sequelize.Op.like]: `%${name}%`},
                    isDeleted: false,
                    '$category.category$': { [sequelize.Op.like]: `%${category}%` }
                },
                include:[
                    {
                        model: model.category,
                        attributes: ['id','category'],
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

            const dataProduct = getProduct.rows.map((product) => {
                const formattedPrice = formatCurrency(parseFloat(product.price));
                return {
                    ...product.toJSON(),
                    price: formattedPrice
                };
            });

            return res.status(200).send({
                data: dataProduct,
                totalPage: Math.ceil(getProduct.count / size),
                datanum: getProduct.count
            })
            
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}