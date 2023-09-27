const { check, validationResult } = require('express-validator');

module.exports = {
    checkUser: async (req, res, next) => {
        try {
            console.log('Request path checkUser :', req.path);

            if (req.path == '/register') {
                await check("email")
                .notEmpty()
                .withMessage("Email field can not be empty")
                .isEmail()
                .withMessage("Please provide a valid email address")
                .run(req);

                await check("username")
                .notEmpty()
                .withMessage("Username can not be empty")
                .isLength({max: 100})
                .withMessage("Username must not exceed 100 characters.")
                .isAlphanumeric()
                .run(req);

                await check("password")
                .notEmpty()
                .isStrongPassword({
                    minLength: 6,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 0
                })
                .withMessage('Password must be at least 6 characters long and include at least one lowercase letter, one uppercase letter, and one number.')
                .run(req);

                await check("role_id")
                .notEmpty()
                .withMessage("Role ID is required!")
                .run(req);
            } else if (req.path == '/auth') {
                await check("email")
                .notEmpty()
                .withMessage("Email field can not be empty")
                .isEmail()
                .withMessage("Please provide a valid email address")
                .run(req);

                await check("password")
                .notEmpty()
                .withMessage("Password field can not be empty")
                .isStrongPassword({
                    minLength: 6,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 0
                })
                .withMessage('Password must be at least 6 characters long and include at least one lowercase letter, one uppercase letter, and one number.')
                .run(req);
            }

            const validation = validationResult(req);
            console.log("Validation result :", validation);
            if (validation.isEmpty()) {
                next();
            } else {
                return res.status(400).send({
                    success: false,
                    message: validation.errors[0].msg,
                    error: validation.errors
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    checkResetPassword: async (req, res, next) => {
        try {
            await check("password")
            .notEmpty()
            .withMessage("Password field cannot be empty")
            .isStrongPassword({
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1, 
                minSymbols: 0
            })
            .withMessage('Password must be at least 6 characters long and include at least one lowercase letter, one uppercase letter, and one number.')
            .run(req)

            await check("confirmationPassword")
            .notEmpty()
            .withMessage("Confirmation password field cannot be empty")
            .custom((value) => {
                if(value !== req.body.password) {
                    throw new Error('Password confirmation does not match password');
                }
                return true
            })
            .run(req)

            const validation = validationResult(req);
            console.log("Validation result :", validation);
            if(validation.isEmpty()) {
                next();
            } else {
                return res.status(400).send({
                    success: false,
                    message: validation.errors[0].msg,
                    error: validation.errors
                })
            }

        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    checkUserUpdate: async (req, res, next) => {
        try {
            await check("email")
            .notEmpty()
            .withMessage("Email field can not be empty")
            .isEmail()
            .withMessage("Please provide a valid email address")
            .run(req)

            await check("username")
            .notEmpty()
            .withMessage("Username can not be empty")
            .isLength({max: 100})
            .withMessage("Username must not exceed 100 characters.")
            .isAlphanumeric()
            .run(req)

            await check("role_id")
            .notEmpty()
            .withMessage("Role ID is required!")
            .run(req)

            const validation = validationResult(req);
            console.log("Validation result :", validation);
            if (validation.isEmpty()) {
                next();
            } else {
                return res.status(400).send({
                    success: false,
                    message: validation.errors[0].msg,
                    error: validation.errors
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    checkProduct: async (req, res, next) => {
        try {
            req.body = JSON.parse(req.body.data);

            const originalName = req.body.name;
            req.body.name = req.body.name.replace(/\s+/g, '');

            await check("name")
            .notEmpty()
            .withMessage("Product name can not be empty")
            .isLength({max: 100})
            .withMessage("Product name must not exceed 100 characters.")
            .isAlphanumeric()
            .run(req);
            await check("price")
            .notEmpty()
            .withMessage("Price can not be empty")
            .isNumeric()
            .withMessage("Price must be numeric")
            .run(req);
            await check("stock")
            .notEmpty()
            .withMessage("Stock can not be empty")
            .isNumeric()
            .withMessage("Stock must be numeric")
            .run(req);
            await check("category_id")
            .notEmpty()
            .withMessage("Category is required!")
            .run(req);

            req.body.name = originalName;
            req.body.data = JSON.stringify(req.body);
            const validation = validationResult(req);
            console.log("Validation result :", validation);
            if(validation.isEmpty()) {
                next();
            } else {
                return res.status(400).send({
                    success: false,
                    message: validation.errors[0].msg,
                    error: validation.errors
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    checkProductUpdate: async (req, res, next) => {
        try {
            req.body = JSON.parse(req.body.data);
            const originalName = req.body.name;
            req.body.name = req.body.name.replace(/\s+/g, '');

            await check("name")
            .optional({ checkFalsy: true })
            .isLength({max: 100})
            .withMessage("Product name must not exceed 100 characters.")
            .isAlphanumeric()
            .run(req)

            await check("price")
            .optional({ checkFalsy: true })
            .isNumeric()
            .withMessage("Price must be numeric")
            .run(req)

            await check("stock")
            .optional({ checkFalsy: true })
            .isNumeric()
            .withMessage("Stock must be numeric")
            .run(req)

            await check("category_id")
            .optional({ checkFalsy: true })
            .run(req)

            req.body.name = originalName;
            req.body.data = JSON.stringify(req.body);
            const validation = validationResult(req);
            console.log("Validation result :", validation);
            if(validation.isEmpty()) {
                next();
            } else {
                return res.status(400).send({
                    success: false,
                    message: validation.errors[0].msg,
                    error: validation.errors
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
            res.status(400).send({
                success: false,
                message: "Invalid form data",
            })
        }
    },
    checkCategory: async (req, res, next) => {
        try {
            const originalName = req.body.category;
            req.body.category = req.body.category.replace(/\s+/g, '');

            await check("category")
            .notEmpty()
            .withMessage("Category name can not be empty")
            .isLength({max: 100})
            .withMessage("Category name must not exceed 100 characters.")
            .isAlphanumeric()
            .run(req);

            req.body.category = originalName;
            const validation = validationResult(req);
            console.log("Validation result :", validation);
            if (validation.isEmpty()) {
                next();
            } else {
                return res.status(400).send({
                    success: false,
                    message: validation.errors[0].msg,
                    error: validation.errors
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    checkCategoryUpdate: async (req, res, next) => {
        try {
            const originalName = req.body.category;
            req.body.category = req.body.category.replace(/\s+/g, '');

            await check("category")
            .notEmpty()
            .withMessage("Category name can not be empty")
            .isLength({max: 100})
            .withMessage("Category name must not exceed 100 characters.")
            .isAlphanumeric()
            .run(req);

            req.body.category = originalName;
            const validation = validationResult(req);
            console.log("Validation result :", validation);
            if (validation.isEmpty()) {
                next();
            } else {
                return res.status(400).send({
                    success: false,
                    message: validation.errors[0].msg,
                    error: validation.errors
                })
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}