module.exports = ({ env }) => ({
  host: env.int('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: 'http://www.orbit-teams.com/api',
  admin: {
    url: '/admin',
    autoOpen: false
  }
})
