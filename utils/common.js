const generateRandomStr = (length = 32) => {
  const base = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let str = '';
  for (let i = 0; i < length; ++i) {
    str += base.charAt(Math.ceil(Math.random() * base.length));
  }

  return str
};

module.exports = {
  generateRandomStr
};
