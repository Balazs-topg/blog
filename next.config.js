/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  },
};
