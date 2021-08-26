const User = require("../../DB/models/hospital/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const path = require("path");

process.env.key = "Derevyanko_Olesya";
const generateJwt = (_id, login) => {
  return jwt.sign({ _id, login }, process.env.key, {
    expiresIn: "24h",
  });
};
const parseJwt = (token) => {
  return jwt.verify(token, process.env.key);
};

module.exports.postUsers = async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    res.status(420).send("Incorrect username or password");
  } else {
    const checkUser = await User.findOne({ login: login });
    if (checkUser) {
      res.status(421).send("User with this login already exists");
    } else {
      const hashPassword = await bcrypt.hash(password, 4);
      const user = new User({ login: login, password: hashPassword });
      user.save();
      const token = generateJwt(user._id, user.login);
      res.send({ token, login });
    }
  }
};

module.exports.getUser = async (req, res) => {
  const { login, password } = req.body;
  const checkUser = await User.findOne({ login: login });
  if (!checkUser) {
    res.status(450).send("This user does not exist");
  } else {
    const comparePassword = bcrypt.compareSync(password, checkUser.password);
    if (!comparePassword) {
      res.status(440).send("The entered password is incorrect");
    } else {
      const token = generateJwt(checkUser._id, checkUser.login);
      res.send({ token, login });
    }
  }
};

module.exports.getUserToLC = async (req, res) => {
  const { headers } = req;
  if (headers.hasOwnProperty("authorization") && headers.authorization) {
    const { _id } = parseJwt(headers.authorization);
    User.find({ _id }).then((result) => {
      console.log(result);
      if (result[0].img) {
        res.send(result[0].img);
      } else res.send("");
    });
  } else {
    res.status(411).send("User not found");
  }
};

module.exports.patchUser = async (req, res) => {
  const { headers, files } = req;
  if (
    headers.hasOwnProperty("authorization") &&
    headers.authorization &&
    files.hasOwnProperty("img") &&
    files.img
  ) {
    const { _id } = parseJwt(headers.authorization);
    const { img } = files;
    let end = img.name.split(".");
    end = end[end.length - 1];
    let fileName = uuid.v4() + "." + end;
    img.mv(path.resolve(__dirname, "../../source/images", fileName));
    fileName = "http://localhost:8080/" + fileName;
    User.updateOne({ _id }, { img: fileName }).then((result) => {
      res.send(fileName);
    });
  } else {
    res.status(411).send("User not found or image not selected");
  }
};
