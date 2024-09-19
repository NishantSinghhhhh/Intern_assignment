const Joi = require('joi');

const SignUpValidation = (req, res, next) => {
    console.log('Received raw body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));

    if (req.body === undefined) {
        console.error('req.body is undefined. Body parsing may not be set up correctly.');
        return res.status(400).json({ success: false, error: 'Invalid request body' });
    }

    const { name, email, password } = req.body;
    console.log('Extracted data:', { name, email, password });

    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(100)
            .trim()
            .required()
            .messages({
                'string.empty': 'Name is required',
                'string.min': 'Name must be at least 3 characters long',
                'string.max': 'Name cannot exceed 100 characters'
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.empty': 'Email is required',
                'string.email': 'Please enter a valid email address'
            }),

        password: Joi.string()
            .min(6)
            .required()
            .messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters long'
            })
    });

    // Validate the data
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        console.log('Validation error object:', error);

        const formattedErrors = error.details.map(err => ({
            field: err.path[0],
            message: err.message
        }));

        return res.status(400).json({ success: false, errors: formattedErrors });
    }

    // If validation passes, attach the validated data to the request object
    req.validatedData = value;
    next();
};

const signInValidation = (req, res, next) => {
  // Define the validation schema
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  });

  // Log the incoming request body for debugging
  console.log('Incoming request body:', req.body);

  // Validate the request body against the schema
  const { error } = schema.validate(req.body);

  // Log the validation result for debugging
  if (error) {
    console.error('Validation error:', error.details);

    // Respond with a 400 Bad Request status and error details if validation fails
    return res.status(400).json({
      message: "Bad Request",
      error: error.details,
    });
  }

  // Log successful validation
  console.log('Validation successful. Proceeding to the next middleware.');

  // Proceed to the next middleware if validation passes
  next();
};


module.exports = { SignUpValidation , signInValidation};
