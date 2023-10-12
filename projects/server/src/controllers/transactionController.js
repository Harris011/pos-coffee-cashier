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
                            'transaction_id'
                        ],
                        require: false
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

                const dates = new Set(data.transaction_details.map((detail) => detail.dataValues.formatted_date));
                const transaction_dates = dates.size > 0 ? Array.from(dates)[0] : null;

                return {
                    id: data.dataValues.id,
                    user: data.dataValues.user.username,
                    transaction_date: transaction_dates,
                    total_price_sum: formatCurrency(total_price_sum),
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
    }
}