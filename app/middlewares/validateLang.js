const languageJson = require("../utils/language.json")
const logger = require('../utils/logger');

function languageVerify(req, res, next) {
  try {
    let reqLang;
    reqLang = req.headers['language'];
    if ('language' in req.headers) {
      req.lang = reqLang;
      logger.info(`languageVerify-IF case, ${req.lang}`)
    } else {
      req.lang = languageJson.DEFAULT;
      logger.info(`languageVerify-else case, ${req.lang}`)
    }
    next();
  } catch (err) {
    logger.error("languageVerify--", err)
  }
}

module.exports = languageVerify;
