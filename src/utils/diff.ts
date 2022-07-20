import _ from 'lodash';
/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export const diff = (object: Object, base: Object) => {
  function changes(object, base) {
    return _.transform(object, function (result: Object, value, key) {
      if (!base[key]) {
        result[key] = value;
      } else {
        if (_.isObject(value)) {
          result[key] = changes(value, base[key]);
        }
      }
    });
  }
  const diffObj = changes(object, base);

  function removeEmptyObjects(obj) {
    return _(obj)
      .pickBy(_.isObject)
      .mapValues(removeEmptyObjects)
      .omitBy(_.isEmpty)
      .assign(_.omitBy(obj, _.isObject))
      .value();
  }

  return removeEmptyObjects(diffObj);
};
