module.exports = (str = "") => {
  const chars = "[a-zA-Z0-9\\!\\#\\$\\%\\&\\'\\*\\+\\-\\/\\=\\?\\^\\_\\`\\{\\|\\}\\~\\\.]+";
  const emailRegExp = new RegExp(`${chars}?\@${chars}\\.${chars}`, "g");
  const emails = [...new Set(str.match(emailRegExp) || [])]
    .filter(email => !/\.\./.test(email))
    .map(email => email.toLowerCase());
  return emails;
};
