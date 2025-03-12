/**
 * Проверяет валидность ID.
 * @param {string} id - Идентификатор задачи.
 * @returns {boolean}
 */
function isValidId(id) {
  return !isNaN(id);
}

module.exports = isValidId;
