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
            
            // check email
            if (getUser.length > 0) {
                // check isDeleted
                if (getUser[0].dataValues.isDeleted == false) {
                    // check password
                    let check = bcrypt.compareSync(req.body.password, getUser[0].dataValues.password);
                    if (check) {
                        getUser[0].dataValues.role = getUser[0].dataValues.role.role;
                        let {
                            id,
                            uuid,
                            email,
                            username,
                            role_id,
                            role
                        } = getUser[0].dataValues;

                        // generate token
                        let token = createToken({id, uuid, role_id}, '24h');

                        return res.status(200).send({
                            success: true,
                            message: 'Login Success',
                            // id: id,
                            // uuid: uuid,
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
            });

            getUser[0].dataValues.role = getUser[0].dataValues.role.role;
            let {
                id,
                uuid,
                email,
                username,
                role_id,
                role
            } = getUser[0].dataValues;

            // generate token
            let token = createToken({id, uuid, role_id}, '24h');
            return res.status(200).send({
                success: true,
                message: 'Keep login Success',
                // id: id,
                // uuid: uuid,
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
                        message: 'The password and confirmation do not match, Please try again.'
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
    },
    edit: async (req, res, next) => {
        try {
            let checkUser = await model.users.findAll({
                where: {
                    uuid: req.params.uuid
                }
            })

            if (checkUser.length > 0) {
                let checkEmail = await model.users.findAll({
                    where: {
                        email: req.body.email,
                        uuid: {[sequelize.Op.ne]: req.params.uuid}
                    }
                })
                
                if (checkEmail.length == 0) {
                    const {
                        email,
                        username,
                        role_id
                    } = req.body

                    const updateUser = await model.users.update({
                        email,
                        username,
                        role_id
                    }, {
                        where: {
                            uuid: req.params.uuid
                        }
                    })

                    if (updateUser == 1) {
                        res.status(200).send({
                            success: true,
                            message: 'User information updated successfully',
                            data: updateUser
                        })
                    } else {
                        res.status(200).send({
                            success: true,
                            message: 'No user information changed',
                            data: updateUser
                        })
                    }
                    
                } else {
                    res.status(400).send({
                        success: false,
                        message: 'Email already exists, cahange canceled'
                    })
                }
            } else {
                res.status(400).send({
                    success: true,
                    message: 'User not found'
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
            res.status(500).send({
                success: false,
                message: 'An error occurred while processing your request.',
                error: error.message
            })
        }
    },
    drop: async (req, res, next) => {
        try {
            let checkUser = await model.users.findAll({
                where: {
                    uuid: req.params.uuid
                }
            });

            if (checkUser.length > 0) {
                if (checkUser[0].dataValues.isDeleted == false) {
                    await model.users.update({isDeleted: 1}, {
                        where: {
                            uuid: req.params.uuid
                        }
                    })
    
                    res.status(200).send({
                        success: true,
                        message: 'This account is now inactive'
                    })
                } else {
                    await model.users.update({isDeleted: 0}, {
                        where: {
                            uuid: req.params.uuid
                        }
                    })
    
                    res.status(200).send({
                        success: true,
                        message: 'This account is now active'
                    })
                }
            } else {
                res.status(400).send({
                    success: false,
                    message: 'User not found'
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    reset: async (req, res, next) => {
        try {
            let checkUser = await model.users.findAll({
                where: {
                    uuid: req.params.uuid
                }
            })

            if (checkUser.length > 0) {
                if (req.body.password && req.body.confirmationPassword) {
                    if (req.body.password === req.body.confirmationPassword) {
                        newPassword = bcrypt.hashSync(req.body.password, salt);
    
                        await model.users.update({
                            password: newPassword
                        }, {
                            where: {
                                uuid: req.params.uuid
                            }
                        })
                        return res.status(200).send({
                            success: true,
                            message: 'Password has been change successful'
                        })
                    } else {
                        return res.status(400).send({
                            success: false,
                            message: 'Password and confiramtion password do not match'
                        })
                    }
                } else {
                    return res.status(400).send({
                        success: false,
                        message: 'Please complete required fields'
                    })
                }
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'User not found'
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    userList: async (req, res, next) => {
        try {
            let {
                page,
                size,
                sortby,
                order,
                username,
                role_id
            } = req.query;

            if (!page) {
                page = 0;
            }

            if (!size) {
                size = 10;
            }

            if (!sortby) {
                sortby= 'username';
            }

            if (!order) {
                order = 'ASC';
            }

            if (!username) {
                username = '';
            }

            if (!role_id) {
                role_id = '';
            }

            let getUser = await model.users.findAndCountAll({
                attributes: ['uuid', 'username', 'email', 'role_id', 'isDeleted'],
                where: {
                    username: {[sequelize.Op.like]: `%${username}%`}
                },
                include: [
                    {
                        model: model.role,
                        attributes: ['role']
                    }
                ],
                offset: parseInt(page * size),
                limit: parseInt(size),
                order: [[sortby, order]]
            })

            return res.status(200).send({
                data: getUser.rows,
                totalPage: Math.ceil(getUser.count / size),
                datanum: getUser.count
            })

        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    roleList: async (req, res, next) => {
        try {
            let getRole = await model.role.findAll({
                attributes: ['id', 'role']
            })
            return res.status(200).send({
                success: true,
                data: getRole
            })
        } catch (error) {
            console.log(error);
            next(error);
        }
    }, 
    userCount: async (req, res, next) => {
        try {
            let getUser = await model.users.findAll({
                attributes: ['uuid', 'username', 'role_id', 'isDeleted']
            })
            return res.status(200).send({
                success: true,
                data: getUser,
                datanum: getUser.count
            })
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}