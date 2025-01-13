import { body } from "express-validator";

const registerValidation = [
    body("email").trim().isEmail().escape(),
    body("username").trim().isLength({ min: 3, max: 25 }).escape(),
    body("password")
        .isLength({ min: 8 })
        .matches(/[A-Z]/)
        .matches(/[a-z]/)
        .matches(/[0-9]/)
        .matches(/[#?!&]/)
        .escape(),
    body("isAdmin").optional().isBoolean()
];

const loginValidation = [
    body("email").trim().isEmail().escape(),
    body("password").trim().escape()
];

export { registerValidation, loginValidation };