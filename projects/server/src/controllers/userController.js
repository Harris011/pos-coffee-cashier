const sequelize = require('sequelize');
const model = require('../models');
const bcrypt = require('bcrypt');
const {createToken} = require('../helper/jwt');
const {v4 : uuidv4} = require('uuid');

let salt = bcrypt.genSaltSync(10);

module.exports = {
    login: async (req, res, next) => {
        try {
            const getUser = await model.users.findAll({
                where: {
                    email: req.body.email
                },
                include: [
                    {
                        model: model.role,
                        attributes: ['role']
                    }
                ]
            });
            console.log('User that login :', getUser);
            // check email
            if (getUser.length > 0) {
                // check isDeleted
                if (getUser[0].dataValues.isDeleted == false) {
                    // check password
                    let check = bcrypt.compareSync(req.body.password, getUser[0].dataValues.password);
                    if (check) {
                        getUser[0].dataValues.role = getUser[0].dataValues.role.role;
                        let {
                            uuid,
                            email,
                            username,
                            role_id,
                            role
                        } = getUser[0].dataValues;

                        // generate token
                        let token = createToken({uuid, role_id}, '24h');

                        return res.status(200).send({
                            success: true,
                            message: 'Login Success',
                            uuid: uuid,
                            email: email,
                            username: username,
                            role_id: role_id,
                            role: role,
                            token: token
                        })
                    } else {
                        return res.status(400).send({
                            success: false,
                            message: 'Login failed, password is wrong'
                        })
                    }
                } else {
                    return res.status(400).send({
                        success: false,
                        message: 'Your account is inactive. Please contact admin for further information'
                    })
                }
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Email not found'
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    keeplogin: async (req, res, next) => {
        try {
            console.log("Decrypt token :", req.decrypt);
            let getUser = await model.users.findAll({
                where: {
                    uuid: req.decrypt.uuid
                },
                include: [
                    {
                        model: model.role,
                        attributes: ['role']
                    }
                ]
            })

            console.log("user keeplogin :", getUser);
            getUser[0].dataValues.role = getUser[0].dataValues.role.role;
            let {
                uuid,
                email,
                username,
                role_id,
                role
            } = getUser[0].dataValues;

            // generate token
            let token = createToken({uuid, role_id}, '24h');
            return res.status(200).send({
                success: true,
                message: 'Keep login Success',
                email: email,
                username: username,
                role_id: role_id,
                role: role,
                token: token
            })
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    register: async (req, res, next) => {
        const ormTransaction = await model.sequelize.transaction();
        try {
            let checkUser = await model.users.findAll({
                where: {
                    email: req.body.email
                }
            });

            console.log('Check user :', checkUser);

            if (checkUser.length == 0) {
                if (req.body.password == req.body.confirmationPassword){
                    delete req.body.confirmationPassword;

                    req.body.password = bcrypt.hashSync(req.body.password, salt);
                    const uuid = uuidv4();
                    const {
                        email,
                        username,
                        password,
                        role_id,
                    } = req.body ;

                    let regis = await model.users.create({
                        uuid,
                        email,
                        username,
                        password,
                        role_id,
                        isDeleted: 0
                    });
                    await ormTransaction.commit();
                    return res.status(200).send({
                        success: true,
                        message: 'Create Success',
                        data: regis
                    })
                } else {
                    return res.status(400).send({
                        success: false,
                        message: 'The password do not match, Please try again.'
                    })
                }

            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Email exist, Please enter a different email address'
                })
            }
        } catch (error) {
            await ormTransaction.rollback();
            console.log(error);
            next(error);
        }
    }
}