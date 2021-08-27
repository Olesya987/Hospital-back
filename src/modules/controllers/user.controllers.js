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
  // #swagger.tags = ['User']
  // #swagger.description = 'добавление нового пользователя'

  /* #swagger.parameters['AddUser'] = {
        in: 'body',
        description: 'new user',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/AddUser" }
      } */
  const { login, password } = req.body;
  if (!login || !password) {
    /* #swagger.responses[420] = { 
        description: 'Incorrect username or password' 
      } */
    res.status(420).send("Incorrect username or password");
  } else {
    const checkUser = await User.findOne({ login: login });
    if (checkUser) {
      /* #swagger.responses[421] = { 
          description: 'User with this login already exists' 
        } */
      res.status(421).send("User with this login already exists");
    } else {
      const img = "";
      const hashPassword = await bcrypt.hash(password, 4);
      const user = new User({ login: login, password: hashPassword, img });
      user.save();
      const token = generateJwt(user._id, user.login);
      res.send({ token, login, img });
    }
  }
};

module.exports.getUser = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'поиск пользователя'

  /* #swagger.parameters['AddUser'] = {
        in: 'body',
        description: 'new user',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/AddUser" }
      } */
  const { login, password } = req.body;
  const checkUser = await User.findOne({ login });
  if (!checkUser) {
    /* #swagger.responses[450] = { 
        description: 'This user does not exist' 
      } */
    res.status(450).send("This user does not exist");
  } else {
    const comparePassword = bcrypt.compareSync(password, checkUser.password);
    if (!comparePassword) {
      /* #swagger.responses[440] = { 
          description: 'The entered password is incorrect' 
        } */
      res.status(440).send("The entered password is incorrect");
    } else {
      const { _id, login, img } = checkUser;
      const token = generateJwt(_id, login);
      res.send({ token, login, img });
    }
  }
};

module.exports.patchUser = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'добавление или обновление изображения пользователя'

  /* #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'token',
        required: true,
        type: 'string',
      } */

  /* #swagger.parameters['img'] = {
        in: 'formData',
        description: 'file',
        required: true,
        type: 'file',
      } */
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
    /* #swagger.responses[411] = { 
          description: 'User not found or image not selected' 
        } */
    res.status(411).send("User not found or image not selected");
  }
};
