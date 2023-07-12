const languageJson = require("../utils/language.json")
const logger = require('../utils/logger');

async function languageVerify(req, res, next) {
  try {
    let reqLang;
    reqLang = req.headers['language'];
    if ('language' in req.headers) {
      console.log('Object.values(jsonObject).includes(value)',Object.values(languageJson).includes(reqLang))
      let lang_check=Object.values(languageJson).includes(reqLang);
      console.log('lang_check',lang_check);
      if (lang_check==true) {
        req.lang = reqLang;
        logger.info(`languageVerify-IF case inside, ${req.lang}`)
      } else {
        req.lang = languageJson.DEFAULT;
        logger.info(`languageVerify-else case inside, ${req.lang}`)
      }
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
