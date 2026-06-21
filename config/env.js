const joi = require("joi");

const envSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid("development", "production", "test")
      .default("development"),
    PORT: joi.number().port().default(8080),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().min(1).required(),
    JWT_EXPIRES_IN: joi.string().required(),
    FRONTEND_URL: joi.string().uri().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    STRIPE_WEBHOOK_SECRET: joi.string().required(),
    CLOUDINARY_CLOUD_NAME: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_API_SECRET: joi.string().required(),
    EMAIL_USER: joi.string().email().required(),
    EMAIL_PASSWORD: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  console.error("Environment validation failed:");
  for (const detail of error.details) {
    console.error(`  - ${detail.message}`);
  }
  process.exit(1);
}

module.exports = value;
