'use strict';

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const _ = require('lodash');
const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {
  /**
   * Retrieve a user record.
   * @return {Object}
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const populate = ['goals', 'ideas'];

    let data = await strapi.plugins['users-permissions'].services.user.fetch({
      id,
    }, populate);

    if (data) {
      data.me = id === ctx.req.user.id;
      data.goals = data.goals.map((goal) => (
        {
          id: goal.id,
          label: goal.label,
        }
      ));

      if (data.photo) {
        data.photo = [data.photo.formats.thumbnail.url]
      } else {
        delete data.photo;
      }

      if (data.ideas) {
        data.ideas = data.ideas.map((idea) => (
          {
            id: idea.id,
            title: idea.title,
            creator: idea.creator === id,
          }
        ));
      }

      delete data.provider;
      delete data.username;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.__v;
      delete data._id;
      delete data.role;
      delete data.confirmed;
      delete data.blocked;
      data = sanitizeUser(data);
    }

    // Send 200 `ok`
    ctx.body = data;
  },

  /**
   * Retrieve authenticated user.
   * @return {Object|Array}
   */
  async me(ctx) {
    const user = ctx.state.user;
    const { id } = user;

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }

    const populate = ['goals', 'ideas'];

    let data = await strapi.plugins['users-permissions'].services.user.fetch({
      id,
    }, populate);

    if (data) {
      data.me = true;
      data.goals = data.goals.map((goal) => (
        {
          id: goal.id,
          label: goal.label,
        }
      ));

      if (data.photo) {
        data.photo = [data.photo.formats.thumbnail.url]
      } else {
        delete data.photo;
      }

      if (data.ideas) {
        data.ideas = data.ideas.map((idea) => (
          {
            id: idea.id,
            title: idea.title,
            creator: idea.creator === id,
          }
        ));
      }

      delete data.provider;
      delete data.username;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.__v;
      delete data._id;
      delete data.role;
      delete data.confirmed;
      delete data.blocked;
      data = sanitizeUser(data);
    }

    // Send 200 `ok`
    ctx.body = data;
  },

  /**
   * Retrieve user records.
   * @return {Object|Array}
   */
  async find(ctx, next, { populate } = {}) {
    // Decompose data from user making request
    const userGoals = ctx.req.user.goals;
    const userCollaboration = ctx.req.user.collaboration;

    // Decompose query parameters
    const { term, collaboration } = ctx.query;

    // Construct query filters
    const termRegex = new RegExp(term);
    const limit = Number(ctx.query._limit) || 12;
    const start = Number(ctx.query._start) || 0;

    const collaborationRegex = new RegExp(
      collaboration
      ? userCollaboration.split(' ').join('|')
      : '.*'
    );

    // Get 'User' model
    const { model } = await strapi.query('user', 'users-permissions');

    // Perform query, filters, sorting, limiting
    let users = await model.aggregate([
      {
        $match: {
          $and: [
            { collaboration: { $regex: collaborationRegex, $options: 'i' } }
          ],
          $or: [
            { name: { $regex: termRegex, $options: 'i' } },
            { bio: { $regex: termRegex, $options: 'i' } },
            { institution: { $regex: termRegex, $options: 'i' } },
            { position: { $regex: termRegex, $options: 'i' } },
            { discipline_1: { $regex: termRegex, $options: 'i' } },
            { discipline_2: { $regex: termRegex, $options: 'i' } },
            { interests: { $regex: termRegex, $options: 'i' } }
          ]
        }
      },
      {
        $set: {
          matchedCount: {
            $size: {
              $setIntersection: ["$goals", userGoals]
            }
          }
        }
      },
      { $sort: { matchedCount: -1 } },
      { $skip: start },
      { $limit: limit },
      {
        $set: {
          goals: {
            $setIntersection: ["$goals", userGoals]
          }
        }
      },
      {
        $lookup: {
          from: 'goals',
          localField: 'goals',
          foreignField: '_id',
          as: 'goals'
        }
      },
      {
        $lookup: {
          from: 'upload_file',
          localField: 'photo',
          foreignField: '_id',
          as: 'photo'
        }
      },
      {
        "$addFields": {
          "goals": {
            "$map": {
              "input": "$goals",
              "as": "goal",
              "in": "$$goal.label"
            }
          }
        }
      },
      {
        "$addFields": {
          "photo": {
            "$map": {
              "input": "$photo",
              "as": "photo",
              "in": "$$photo.formats.thumbnail.url"
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          institution: 1,
          photo: 1,
          goals: 1
        }
      }
    ]);

    // Sanitize data (removes any fields labled private in db schema)
    const data = users.map(sanitizeUser);

    // Return results
    ctx.send(data);
  },

 /**
   * Create a/an user record.
   * @return {Object}
   */
  async create(ctx) {
    const advanced = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced',
      })
      .get();
    const { email, password, role } = ctx.request.body;
    if (!email) return ctx.badRequest('missing.email');
    if (!password) return ctx.badRequest('missing.password');

    if (advanced.unique_email) {
      const userWithSameEmail = await strapi.query('user', 'users-permissions').findOne({ email });
      if (userWithSameEmail) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.taken',
            message: 'Email already taken.',
            field: ['email'],
          })
        );
      }
    }
    const user = {
      ...ctx.request.body,
      provider: 'local',
    };
    if (!role) {
      const defaultRole = await strapi
        .query('role', 'users-permissions')
        .findOne({ type: advanced.default_role }, []);
      user.role = defaultRole.id;
    }
    try {
      const data = await strapi.plugins['users-permissions'].services.user.add(user);
      ctx.created(sanitizeUser(data));
    } catch (error) {
      ctx.badRequest(null, formatError(error));
    }
  },

  /**
   * Update a/an user record.
   * @return {Object}
   */
  async update(ctx) {
    const advancedConfigs = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced',
      })
      .get();
    const { id } = ctx.params;
    const { email, password } = ctx.request.body;
    const user = await strapi.plugins['users-permissions'].services.user.fetch({
      id,
    });
    if (_.has(ctx.request.body, 'email') && !email) {
      return ctx.badRequest('email.notNull');
    }
    if (_.has(ctx.request.body, 'password') && !password && user.provider === 'local') {
      return ctx.badRequest('password.notNull');
    }
    if (_.has(ctx.request.body, 'email') && advancedConfigs.unique_email) {
      const userWithSameEmail = await strapi.query('user', 'users-permissions').findOne({ email });
      if (userWithSameEmail && userWithSameEmail.id != id) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.taken',
            message: 'Email already taken',
            field: ['email'],
          })
        );
      }
    }
    let updateData = {
      ...ctx.request.body,
    };
    if (_.has(ctx.request.body, 'password') && password === user.password) {
      delete updateData.password;
    }
    const data = await strapi.plugins['users-permissions'].services.user.edit({ id }, updateData);
    ctx.send(sanitizeUser(data));
  },

  /**
   * Retrieve ideas associated with user.
   * @return {Object|Array}
   */
  async ideas(ctx) {
    const ideas = await strapi.services.idea.search(ctx.query);
    // Use assigned ID if provided
    let { id } = ctx.params;
    if (!id) {
      // If no ID provided, default to self.
      id = ctx.state.user.id;
    }
    const filtered = [];
    ideas.forEach((idea) => {
      const isMember = idea.members.filter((member) => member.id === id).length > 0;
      if (isMember) {
        idea.bookmarked_count = idea.bookmarked_by.length;
        filtered.push(idea);
      }
    });
    ctx.send(filtered);
  },
  /**
   * Retrieve an associated user's bookmarks.
   * @return {Object|Array}
   */
  async bookmarks(ctx) {
    const { id, bookmarked_ideas } = ctx.state.user;
    let collection = [];
    for (let i = 0; i < bookmarked_ideas.length; i += 1) {
      const idea = await strapi.services.idea.find({ "id": bookmarked_ideas[i] });
      collection.push(idea);
    }
    collection = collection.flat();
    collection.map((match) => {
      let entity = match;
      entity.bookmarked_count = !!entity.bookmarked_by ? entity.bookmarked_by.length : 0;
      delete entity.bookmarked_by;
      entity = sanitizeEntity(entity, { model: strapi.models.idea });
    });
    ctx.send(collection)
  },

  /**
   * Destroy a/an user record.
   * @return {Object}
   */
  async destroy(ctx) {
    const { id } = ctx.params;
    const ideasCreated = await strapi.services.idea.find({ "creator": id });

    if (ideasCreated) {
      for (let i = 0; i < ideasCreated.length; i += 1) {
        const idea = ideasCreated[i];
        const data = await strapi.services.idea.delete({ id: idea.id });
      }
    }

    const data = await strapi.plugins['users-permissions'].services.user.remove({ id });
    ctx.send(sanitizeUser(data));
  }
};
