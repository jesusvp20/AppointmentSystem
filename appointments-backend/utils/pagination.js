/**
 * Paginates a Mongoose Query.
 * @param {Object} model - Mongoose Model
 * @param {Object} query - Mongoose Query Object
 * @param {Object} options - Pagination options { page, limit, populate }
 * @returns {Object} { data, meta: { totalItems, itemPages, limit, currentPage } }
 */
export const paginate = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  
  const skip = (page - 1) * limit;

  let queryBuilder = model.find(query);
  
  if (options.populate) {
    queryBuilder = queryBuilder.populate(options.populate);
  }

  // Optimize executing count and find in parallel
  const [data, totalItems] = await Promise.all([
    queryBuilder.skip(skip).limit(limit).exec(),
    model.countDocuments(query).exec()
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    meta: {
      totalItems,
      totalPages,
      limit,
      currentPage: page
    }
  };
};
