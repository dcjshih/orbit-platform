'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
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
    const { model } = await strapi.query('idea');

    // Perform query, filters, sorting, limiting
    let ideas = await model.aggregate([
      {
        $match: {
          $and: [
            { collaboration: { $regex: collaborationRegex, $options: 'i' } },
          ],
          $or: [
            { title: { $regex: termRegex, $options: 'i' } },
            { description: { $regex: termRegex, $options: 'i' } },
            { institution: { $regex: termRegex, $options: 'i' } },
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
          from: 'users-permissions_user',
          localField: '_id',
          foreignField: 'bookmarked_ideas',
          as: 'bookmarked_by'
        }
      },
      {
        $set: {
          bookmarked_count: {
            $size: '$bookmarked_by'
          }
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
        $project: {
          title: 1,
          goals: 1,
          bookmarked_count: 1,
        }
      }
    ]);

    // Return results
    ctx.send(ideas);
  },

  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.idea.findOne({ id });
    entity.bookmarked_count = entity.bookmarked_by.length;
    return sanitizeEntity(entity, { model: strapi.models.idea });
  },
};