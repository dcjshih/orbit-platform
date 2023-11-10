module.exports = ({ env }) => ({
  email: {
    provider: 'sendgrid',
    providerOptions: {
      apiKey: env('SENDGRID_API_KEY'),
    },
    settings: {
      defaultFrom: 'no-reply@orbit-teams.com',
      defaultReplyTo: 'no-reply@orbit-teams.com',
    },
  },
});
