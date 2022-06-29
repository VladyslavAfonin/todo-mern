const Validator = require("validator");
const isEmpty = require("./isEmpty")

const validateTodoInput = (data) => {
    let errors = {};

    if(isEmpty(data.content)) {
        errors.content = "Content field can't be empty"
    } else if (!Validator.isLength(data.content, {min: 6, max: 150})) {
        errors.content = "Content must be between 6 and 150 characters long"
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = validateTodoInput;