module.exports = ({ env }) => ({
  host: env.int('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: 'http://localhost/api',
  admin: {
    url: '/admin',
    autoOpen: false,
    auth: {
      secret: env('STRAPI_ADMIN_JWT_SECRET'),
    },
  }
})
