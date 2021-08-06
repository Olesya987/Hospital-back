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
  const { login, password } = req.body;
  if (!login || !password) {
    res.status(420).send("Incorrect username or password");
  } else {
    const checkUser = await User.findOne({ login: login });
    if (checkUser) {
      res.status(420).send("User with this login already exists");
    } else {
      const hashPassword = await bcrypt.hash(password, 4);
      const user = new User({ login: login, password: hashPassword });
      user.save();
      const token = generateJwt(user._id, user.login);
      res.send({ token });
    }
  }
};

module.exports.getUser = async (req, res) => {
  const { login, password } = req.body;
  const user = await User.findOne({ login: login });
  if (!user) {
    res.status(420).send("This user does not exist");
  } else {
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      res.status(420).send("The entered password is incorrect");
    } else {
      const token = generateJwt(user._id, user.login);
      res.send({ token, login });
    }
  }
};
