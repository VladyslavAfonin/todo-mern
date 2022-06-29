const Validator = require("validator");
const isEmpty = require("./isEmpty")

const validateRegisterInput = (data) => {
    let errors = {};

    if(isEmpty(data.email)) {
        errors.email = "Email field can't be empty"
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid, please provide a valid email"
    }

    if (isEmpty(data.password)) {
        errors.password = "Password field can't be empty"
    } else if (!Validator.isLength(data.password, {min: 6, max: 150})) {
        errors.password = "Password must be between 6 and 150 characters long"
    }

    if(isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "Confirm password field can't be empty"
    } else if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "Password and confirm password fields must match"
    }

    if (isEmpty(data.name)) {
        errors.name = "Name field can't be empty"
    } else if (!Validator.isLength(data.name, {min: 3, max: 150})) {
        errors.name = "Name must be between 3 and 150 characters long"
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = validateRegisterInput;