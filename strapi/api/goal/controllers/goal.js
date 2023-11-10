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
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.goal.search(ctx.query);
    } else {
      entities = await strapi.services.goal.find(ctx.query);
    }

    return entities.map((entity) => {
      delete entity.title;
      delete entity.description;
      delete entity.url;
      delete entity.liked_by;
      delete entity.createdAt;
      delete entity.updatedAt;
      return sanitizeEntity(entity, { model: strapi.models.goal });
    });
  },
};