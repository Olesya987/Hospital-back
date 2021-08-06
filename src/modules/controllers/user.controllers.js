const User = require("../../DB/models/hospital/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

process.env.key = "Derevyanko_Olesya";
const generateJwt = (_id, login) => {
  return jwt.sign({ _id, login }, process.env.key, {
    expiresIn: "24h",
  });
};

module.exports.postUsers = async (req, res) => {
  const { body } = req;
  if (!body.login || !body.password) {
    res.send("Некорректный логин или пароль");
  } else {
    const checkUser = await User.findOne({ login: body.login });
    if (checkUser) {
      res.send("Пользователь с таким логином уже существует");
    } else {
      const hashPassword = await bcrypt.hash(body.password, 4);
      const user = new User({ login: body.login, password: hashPassword });
      user.save();
      const token = generateJwt(user._id, user.login);
      return res.json({ token });
    }
  }
};
