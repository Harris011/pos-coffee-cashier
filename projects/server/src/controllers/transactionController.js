const sequelize = require('sequelize');
const model = require('../models');

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
                sortby,
                order,
                startDate,
                endDate
            } = req.query

            if (!sortby) {
                sortby = 'date';
            }
            if (!order) {
                order = 'ASC';
            }
            if (!startDate) {
                startDate = null;
            }
            if (!endDate) {
                endDate = null;
            }

            let dateRange = {};
            if (startDate && endDate) {
                dateRange.date = {
                    [sequelize.Op.between]: [startDate, endDate]
                };
            } else if (startDate) {
                dateRange.date = {
                    [sequelize.Op.gte]: startDate
                };
            } else if (endDate) {
                dateRange.date = {
                    [sequelize.Op.lte]: endDate
                }
            }

            let getTransaction = await model.transaction_detail.findAndCountAll({
                attributes: [
                    'id',
                    [sequelize.fn('date_format', sequelize.col('date'), '%d/%m/%Y'), 'formatted_date'],
                    [sequelize.fn('SUM', sequelize.col('total_price')), 'total_price_sum']
                ],
                where: dateRange,
                group: ['date'],
                order: [[sortby, order]]
            });
            
            return res.status(200).send({
                success: true,
                data: getTransaction.rows
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    monthlyRevenue: async (req, res, next) => {
        try {
            const revenueData = await model.transaction_detail.findAll({
                attributes: [
                    [sequelize.fn('YEAR', sequelize.col('date')), 'year'],
                    [sequelize.fn('DATE_FORMAT', sequelize.col('date'),'%M'),'month'],
                    [sequelize.fn('SUM', sequelize.col('total_price')), 'total_revenue'],
                ],
                group: ['year', 'month']
            });

            const formattedRevenueData = revenueData.map((revenue) => ({
                year: revenue.dataValues.year,
                month: revenue.dataValues.month,
                total_revenue: formatCurrency(parseInt(revenue.dataValues.total_revenue)),
            }));

            return res.status(200).send({
                success: true,
                data: formattedRevenueData
            });

        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    yearlyRevenue: async (req, res, next) => {
        try {
            const revenueData = await model.transaction_detail.findAll({
                attributes: [
                    [sequelize.fn('YEAR', sequelize.col('date')), 'year'],
                    [sequelize.fn('SUM', sequelize.col('total_price')), 'total_revenue'],
                ],
                group: ['year'],
            });

            const formattedRevenueData = revenueData.map((revenue) => ({
                year: revenue.dataValues.year,
                total_revenue: formatCurrency(parseInt(revenue.dataValues.total_revenue))
            }));
            
            res.status(200).send({
                success: true,
                data: formattedRevenueData
            })

        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    popular: async (req, res, next) => {
        try {
            let {
                sortby,
                order
            } = req.query

            if (!sortby) {
                sortby = 'total_quantity_sum'
            }
            if (!order) {
                order = 'DESC'
            }
            
            const popularProduct = await model.transaction_detail.findAndCountAll({
                attributes: ['product_id', [sequelize.fn('SUM', sequelize.col('total_quantity')), 'total_quantity_sum']],
                include: [
                    {
                        model: model.product,
                        attributes: ['id', 'name']
                    }
                ],
                group: ['product_id'],
                order: [[sortby, order]]

            });

            return res.status(200).send({
                success: true,
                data: popularProduct.rows,
            })

        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    activity: async (req, res, next) => {
        try {
            let {
                page,
                size,
                sortby,
                order,
            } = req.query;

            if (!page) {
                page = 0
            }
            if (!size) {
                size = 2
            }
            if (!sortby) {
                sortby = 'id'
            }
            if (!order) {
                order = 'DESC'
            }

            let getTransaction = await model.transaction.findAndCountAll({
                attributes: [
                    'id',
                    'status_id'
                ],
                include: [
                    {
                        model: model.users,
                        attributes: [
                            'username',
                        ]
                    },
                    {
                        model: model.transaction_detail,
                        attributes: [
                            'id',
                            [sequelize.fn('date_format', sequelize.col('date'), '%d/%m/%Y'), 'formatted_date'],
                            'total_price',
                            'total_price_tax',
                            'transaction_id'
                        ],
                        require: false
                    },
                    {
                        model: model.status,
                        attributes: [
                            'status'
                        ],
                    }
                ],
                offset: parseInt(page * size),
                limit: parseInt(size),
                order: [[sortby, order]]
            });

            const formattedTransactionsData = getTransaction.rows.map((data) => {
                const total_price_sum = data.transaction_details.reduce((sum, detail) => {
                    return sum + parseInt(detail.dataValues.total_price);
                }, 0);

                const total_price_tax_sum = data.transaction_details.reduce((sum, detail) => {
                    return sum + parseInt(detail.dataValues.total_price_tax);
                }, 0);

                const dates = new Set(data.transaction_details.map((detail) => detail.dataValues.formatted_date));
                const transaction_dates = dates.size > 0 ? Array.from(dates)[0] : null;

                return {
                    id: data.dataValues.id,
                    status: data.dataValues.status.status,
                    user: data.dataValues.user.username,
                    transaction_date: transaction_dates,
                    total_price_sum: formatCurrency(total_price_sum),
                    total_price_tax_sum: formatCurrency(total_price_tax_sum),
                }
            });

            const countTransaction = await model.transaction.count();
            
            return res.status(200).send({
                success: true,
                data: formattedTransactionsData,
                totalPage: Math.ceil(countTransaction / size),
                datanum: countTransaction
            });

        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    create: async (req, res, next) => {
        const ormTransaction = await model.sequelize.transaction();
        try {
            // Get current date
            const currentDate = new Date().toLocaleDateString("en-UK", {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).split("/").reverse().join("-");

            // Get the user ID of the logged-in user based on decrypted ID
            const getUser = await model.users.findAll({
                attributes: ['id', 'username'],
                where: {
                    id: req.decrypt.id,
                    uuid: req.decrypt.uuid
                }
            });
            const user_id = getUser[0].dataValues.id // Extract the user ID from the query result

            // Create a new transaction base user_id
            const createTransaction = await model.transaction.create({
                user_id: user_id
            }, {
                transaction: ormTransaction
            });
            const transaction_id = createTransaction.dataValues.id // Store the newly created transaction ID for future use in transaction details
            
            // Require 'transactionDetails' in the request body, 
            // containing 'product_id' and 'total_quantity' to create transaction details
            const {
                transactionDetails
            } = req.body;

            // Retrieve product prices and stock based on an array of product_ids
            const productIds = transactionDetails.map(detail => detail.product_id);

            // Check if the 'productIds' array in req.body is empty
            // if empty, return an error message
            if (productIds.length === 0) {
                await ormTransaction.rollback();
                return res.status(400).send({
                    success: false,
                    message: "Current order can not be empty"
                });
            }
            
            // Retrieve product prices, stock, and names based on 'productIds'
            const getProducts = await model.product.findAll({
                attributes: ['id', 'price', 'stock', 'name'],
                where: {
                    id: productIds
                }
            });

            // Check product stock
            const emptyStock = getProducts.filter(product => product.dataValues.stock === 0);
            if (emptyStock.length > 0) {
                await ormTransaction.rollback();
                return res.status(400).send({
                    success: false,
                    message: "Some selected products are out of stock."
                });
            }
            
            // Check the database query results for 'getProducts'
            // if no products are found, return a 'Product not found' error
            if (getProducts.length === 0) {
                await ormTransaction.rollback();
                return res.status(404).send({
                    success: false,
                    message: "Product not found"
                });
            }

            // Initialize an empty Set to track processed product IDs
            const processedProductIds = new Set();
            // Create an array to store the transaction detail data
            let transactionDetailData = [];
            let updateProduct;
            
            // loop the transactiondetails
            for (const detail of transactionDetails) {
                const productId = detail.product_id;

                // Check if the product ID is already in the Set
                if (processedProductIds.has(productId)){
                    await ormTransaction.rollback();
                    return res.status(400).send({
                        success: false,
                        message: `Can not add same product in the cart`
                    });
                }
                // If the product ID is not in the Set, add it to track its processing
                processedProductIds.add(productId);

                // Find the product associated with the detail
                const correspondingProduct = getProducts.find(product => product.dataValues.id === productId);

                // prepare the transaction detail data
                if (correspondingProduct) {
                    const total_quantity = detail.total_quantity;
                    const total_price_product = correspondingProduct.dataValues.price * total_quantity;
                    const taxRate = detail.taxRate ? parseFloat(detail.taxRate) : 0.10;
                    const taxAmount = total_price_product * taxRate;
                    const total_price_product_tax = total_price_product + taxAmount;

                    transactionDetailData.push({
                        total_quantity: total_quantity,
                        price_on_date: correspondingProduct.dataValues.price,
                        total_price: total_price_product,
                        total_price_tax: total_price_product_tax,
                        product_id: correspondingProduct.dataValues.id,
                        transaction_id: transaction_id,
                        date: currentDate,
                    });
                } else {
                    await ormTransaction.rollback();
                    return res.status(404).send({
                        success: false,
                        message: `Product with ID ${productId} not found.`
                    })
                }
                
                // prepare data update for product stock
                const updateProductStock = getProducts.map(product => {
                    const correspondingDetail = transactionDetails.find(detail => detail.product_id === product.dataValues.id);
                    if (correspondingDetail) {
                        let newQuantity = parseInt(product.dataValues.stock - correspondingDetail.total_quantity);
                        
                        return {
                            id: product.dataValues.id,
                            stock: newQuantity
                        }
                    }
                });
                // create queries for product stock
                const updateQueries = updateProductStock.map(updateData => {
                    return model.product.update(updateData, {
                        where: {
                            id: updateData.id
                        }
                    });
                });
                // Execute update queries
                updateProduct = await Promise.all(updateQueries);
            }

            // Create the transaction details
            const createTransactionDetail = await model.transaction_detail.bulkCreate(transactionDetailData);

            // Retrieve updated product data
            const getUpdatedProduct = await model.product.findAll({
                attributes: ['id', 'price', 'stock', 'name'],
                where: {
                    id: productIds
                }
            });

            await ormTransaction.commit();
            return res.status(200).send({
                success: true,
                data: {
                    message: "Transaction successfully added",
                    createTransaction
                },
                data_2: {
                    message: "Selected product data retrieved",
                    getProducts
                },
                data_3: {
                    message: "Transaction detail successfully created",
                    createTransactionDetail
                },
                data_4: {
                    message: "Product data successfully updated",
                    updateProduct
                },
                data_5: {
                    message: "Updated selected products data retrieved",
                    getUpdatedProduct
                },
            });
            
        } catch (error) {
            await ormTransaction.rollback();
            console.log(error);
            next(error);
        }
    },
    latestTransactions : async (req, res, next) => {
        try {
            let getIncompleteTransaction = await model.transaction.findAll({
                attributes: ['id', 'status_id'],
                where: {
                    status_id: 1
                },
                include: [
                    {
                        model: model.users,
                        attributes: ['username']
                    },
                    {
                        model: model.transaction_detail,
                        attributes: [
                            'id',
                            [sequelize.fn('date_format', sequelize.col('date'), '%d/%m/%Y'), 'formatted_date'],
                            'total_price_tax',
                            'transaction_id'
                        ],
                        required: false
                    },
                    {
                        model: model.status,
                        attributes: ['status'],
                    }
                ],
            });

            if (!getIncompleteTransaction || getIncompleteTransaction.length === 0) {
                return res.status(200).send({
                    success: false,
                    message: "No incomplete transactions found.",
                    data: []
                })
            }

            const formattedTransactionsData = getIncompleteTransaction.map((data) => {
                const total_price_tax_sum = data.transaction_details.reduce((sum, detail) => {
                    return sum + parseInt(detail.dataValues.total_price_tax)
                }, 0);

                const dates = new Set(data.transaction_details.map((detail) => detail.dataValues.formatted_date));
                const transaction_dates = dates.size > 0 ? Array.from(dates)[0]: null;

                return {
                    id: data.dataValues.id,
                    status: data.dataValues.status.status,
                    user: data.dataValues.user.username,
                    transaction_date: transaction_dates,
                    total_price_sum: formatCurrency(total_price_tax_sum),
                }
            });

            return res.status(200).send({
                success: true,
                data: formattedTransactionsData
            });

        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    pay: async (req, res, next) => {
        try {
            if (!req.params.id || req.params.id.trim() === '') {
                return res.status(404).send({
                    success: false,
                    message: "Transaction not found"
                });
            }

            let checkTransaction = await model.transaction.findOne({
                where: {
                    id: req.params.id
                }
            });
            
            if (!checkTransaction) {
                return res.status(404).send({
                    success: false,
                    message: "Transaction not found"
                });
            }

            if (checkTransaction.status_id === 1) {
                await model.transaction.update({status_id: 2}, {
                    where: {
                        id: req.params.id
                    }
                })

                return res.status(200).send({
                    success: true,
                    message: "Payment Success"
                });
            } else {
                return res.status(409).send({
                    success: false,
                    message: "Already paid"
                });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    details: async (req, res, next) => {
        try {
            const getTransaction = await model.transaction.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'status_id'],
                include: [
                    {
                        model: model.users,
                        attributes: ['username']
                    },
                    {
                        model: model.transaction_detail,
                        attributes: [
                            'id',
                            [sequelize.fn('date_format', sequelize.col('date'), '%d/%m/%Y'), 'formatted_date'],
                            'total_quantity',
                            'total_price',
                            'total_price_tax',
                            'product_id',
                            'transaction_id'
                        ],
                        include: [
                            {
                                model: model.product,
                                attributes: ['id', 'name', 'price']
                            }
                        ],
                        required: false
                    }
                ]
            });

            const total_price_tax_sum = getTransaction.transaction_details.reduce((sum, detail) => {
                return sum + parseInt(detail.dataValues.total_price_tax);
            }, 0);

            const formattedTransactionsData = {
                id: getTransaction.id,
                status_id: getTransaction.status_id,
                user: getTransaction.user.username,
                transaction_details: getTransaction.transaction_details.map((detail) => ({
                    productId : detail.dataValues.product_id,
                    name : detail.product.name,
                    quantity : detail.dataValues.total_quantity,
                    price_tax : detail.dataValues.product.price + parseFloat(detail.dataValues.product.price * 0.10),
                    subTotal: detail.dataValues.total_price_tax
                })),
                total_price_tax_sum: formatCurrency(total_price_tax_sum)
            }

            return res.status(200).send({
                success: true,
                data: formattedTransactionsData
            });

        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}