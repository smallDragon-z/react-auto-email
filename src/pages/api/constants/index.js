const URL_REG =
  /^(((ht|f)tps?):\/\/)?(([\w-]+\.)*([\w-]+|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\blocalhost\b)+)(:[0-9]+)?([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

const DOUBLE_SLASH_REG = /^\/\//; // 匹配以双斜杠开头
const SINGLE_SLASH_REG = /^\//; // 匹配以单斜杠开头
export {
  /*
   * URL的正则表达式
   * */
  URL_REG,
  /*
   * 匹配以双斜杠开头
   * */
  DOUBLE_SLASH_REG,
  /*
   * 匹配以单斜杠开头
   * */
  SINGLE_SLASH_REG,
};
