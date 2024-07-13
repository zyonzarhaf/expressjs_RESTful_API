import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config({ path: '../.env'});

const envVarsSchema = Joi.object({
    ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    URI: Joi.string().required(),
    JWT_SECRET: Joi.string().required()
});

const envVars = {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    URI: process.env.URI,
    JWT_SECRET: process.env.JWT_SECRET
}

const { result, error } = envVarsSchema.validate(envVars);

if (error) throw new Error(`environment variables validation error ${error.message}`);

export default envVars;
