'use strict';

const goalDefinitions = require('./bootstrap/un_sustainable_development_goals.json');

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 */


// Load environmental variables
const STRAPI_ADMIN_USERNAME = process.env.STRAPI_ADMIN_USERNAME;
const STRAPI_ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD;
const STRAPI_ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL;

// Create an admin acount if none exists
async function bootstrapAdmin() {
  strapi.log.info('Bootstrapping admin account');
  const admin_orm = strapi.query('administrator', 'admin');
  const admins = await admin_orm.find({ username: STRAPI_ADMIN_USERNAME });
  if (admins.length === 0) {
    const blocked = false;
    const username = STRAPI_ADMIN_USERNAME;
    const password = await strapi.admin.services.auth.hashPassword(STRAPI_ADMIN_PASSWORD);
    const email = STRAPI_ADMIN_EMAIL;
    const user = { blocked, username, password, email };

    const data = await admin_orm.create(user);
    strapi.log.warn(`Bootstrapped admin account: ${JSON.stringify(user)}`);
  }
}

const authenticatedPermissions = {
  goal: [
    'count',
    'find',
    'findone',
  ],
  idea: [
    'count',
    'create',
    'delete',
    'find',
    'findone',
    'update',
  ],
  user: [
    'bookmarks',
    'count',
    'destroy',
    'find',
    'findone',
    'ideas',
    'me',
    'update',
  ],
  report: [
    'create',
  ],
  auth: [
    'resetpassword',
  ]
};

async function bootstrapAuthenticatedPermissions() {
  strapi.log.info('Bootstrapping permissions for authenticated users:');
  const authenticated = await strapi.query('role', 'users-permissions')
    .findOne({ type: 'authenticated' });

  authenticated.permissions.forEach((permission) => {
    if (permission.type === 'application') {
      const actions = authenticatedPermissions[permission.controller];
      if (actions.includes(permission.action)) {
        const newPermission = permission;
        newPermission.enabled = true;
        strapi.log.info(`Enabling ${permission.controller} -> ${permission.action}`);
        strapi.query('permission', 'users-permissions').update(
          { id: newPermission.id },
          newPermission,
        );
      }
    }

    if (permission.type === 'upload' && permission.action === 'upload') {
        const newPermission = permission;
        newPermission.enabled = true;
        strapi.log.info(`Enabling ${permission.controller} -> ${permission.action}`);
        strapi.query('permission', 'users-permissions').update(
          { id: newPermission.id },
          newPermission,
        );
    }

    if (permission.type === 'users-permissions') {
      const actions = authenticatedPermissions[permission.controller];
      if (permission.controller === 'user' && actions.includes(permission.action)) {
        const newPermission = permission;
        newPermission.enabled = true;
        strapi.log.info(`Enabling ${permission.controller} -> ${permission.action}`);
        strapi.query('permission', 'users-permissions').update(
          { id: newPermission.id },
          newPermission,
        );
      }
    }
  });
  strapi.log.info('Bootstrapped permissions for authenticated users');
}

async function bootstrapPublicPermissions() {
  strapi.log.info('Bootstrapping permissions for public users:');
  const publicUser = await strapi.query('role', 'users-permissions')
    .findOne({ type: 'public' });

  publicUser.permissions.forEach((permission) => {
    if (permission.type === 'application') {
      const newPermission = permission;
      // Editing permission as needed
      if (permission.controller === 'goal'
        && (permission.action === 'find' || permission.action === 'findone' || permission.action === 'count')) {
        newPermission.enabled = true;
        strapi.log.info(`Enabling ${permission.controller} -> ${permission.action}`);
        // Updating Strapi with the permission
        strapi.query('permission', 'users-permissions').update(
          { id: newPermission.id },
          newPermission,
        );
      }
    }

    if (permission.type === 'users-permissions') {
      const actions = authenticatedPermissions[permission.controller];
      if (permission.controller === 'auth' && actions.includes(permission.action)) {
        const newPermission = permission;
        newPermission.enabled = true;
        strapi.log.info(`Enabling ${permission.controller} -> ${permission.action}`);
        strapi.query('permission', 'users-permissions').update(
          { id: newPermission.id },
          newPermission,
        );
      }
    }

  });
  strapi.log.info('Bootstrapped permissions for public users');
}

async function bootstrapGoals() {
  strapi.log.info('Bootstrapping UN sustainable development goals.');
  const goals_orm = strapi.query('goal');
  const goals = await goals_orm.find({ goal: 1 });
  if (goals.length === 0) {
    for (let i = 0; i < goalDefinitions.length; i += 1) {
      const goal = goalDefinitions[i];
      await goals_orm.create(goal);
    }
  } else {
    strapi.log.info('Bypassing goals.');
  }
}

module.exports = () => {
  bootstrapAdmin();
  bootstrapAuthenticatedPermissions();
  bootstrapPublicPermissions();
  bootstrapGoals();
};
