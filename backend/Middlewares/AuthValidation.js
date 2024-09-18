const Joi = require('joi');

const SignUpValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .trim()
      .required()
      .error(new Error('Name must be between 3 and 100 characters')),

    email: Joi.string()
      .email()
      .required()
      .error(new Error('Please enter a valid email address')),

    password: Joi.string()
      .min(6)
      .required()
      .error(new Error('Password must be at least 6 characters long')),
  });

  // Validate the data
  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    // Log the error object to inspect its structure
    console.log('Validation error object:', error);

    let formattedErrors = [];
    if (error.details && Array.isArray(error.details)) {
      for (const err of error.details) {
        formattedErrors.push({
          field: err.context.key,
          message: err.message,
        });
      }
    } else {
      formattedErrors.push({
        field: 'unknown',
        message: 'An unknown validation error occurred',
      });
    }

    return { error: true, errors: formattedErrors };
  }

  return { error: false, data: value };
};

module.exports = { SignUpValidation };
