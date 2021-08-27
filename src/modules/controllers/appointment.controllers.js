const Appointment = require("../../DB/models/hospital/appointments");
const jwt = require("jsonwebtoken");
const appointments = require("../../DB/models/hospital/appointments");

process.env.key = "Derevyanko_Olesya";
const parseJwt = (token) => {
  return jwt.verify(token, process.env.key);
};

module.exports.getPag = (req, res) => {
  // #swagger.tags = ['Appointment']
  // #swagger.description = 'вывод записей пользователя'

  /* #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'token',
        required: true,
        type: 'string',
      } */
  /* #swagger.parameters['GetAppointments'] = {
        in: 'body',
        description: 'all appointments',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/GetAppointments" }
      } */
  const { body } = req;
  const tokenUser = parseJwt(req.headers.authorization);
  const rowsOnPage = +body.rowsOnPage || 5;
  const currentPage = +body.currentPage || 1;
  if (
    body.hasOwnProperty("value") &&
    body.hasOwnProperty("direction") &&
    body.hasOwnProperty("before") &&
    body.hasOwnProperty("after") &&
    body.value &&
    body.direction &&
    body.before &&
    body.after
  ) {
    const { value, direction, before, after } = body;

    Appointment.find(
      { userId: tokenUser._id, date: { $gte: before, $lte: after } },
      ["name", "date", "docName", "complaints"]
    )
      .sort({ [value]: direction === "asc" ? 1 : -1 })
      .skip(rowsOnPage * currentPage - rowsOnPage)
      .limit(rowsOnPage)
      .then((appointments) => {
        Appointment.count({
          userId: tokenUser._id,
          date: { $gte: before, $lte: after },
        }).then((result) => {
          res.send({
            allRows: result,
            appointments,
          });
        });
      });
  } else if (
    body.hasOwnProperty("value") &&
    body.hasOwnProperty("direction") &&
    body.value &&
    body.direction
  ) {
    const { value, direction } = body;

    Appointment.find({ userId: tokenUser._id }, [
      "name",
      "date",
      "docName",
      "complaints",
    ])
      .sort({ [value]: direction === "asc" ? 1 : -1 })
      .skip(rowsOnPage * currentPage - rowsOnPage)
      .limit(rowsOnPage)
      .then((appointments) => {
        Appointment.count({ userId: tokenUser._id }).then((result) => {
          res.send({
            allRows: result,
            appointments,
          });
        });
      });
  } else if (
    body.hasOwnProperty("before") &&
    body.hasOwnProperty("after") &&
    body.before &&
    body.after
  ) {
    const { before, after } = body;

    Appointment.find(
      { userId: tokenUser._id, date: { $gte: before, $lte: after } },
      ["name", "date", "docName", "complaints"]
    )
      .skip(rowsOnPage * currentPage - rowsOnPage)
      .limit(rowsOnPage)
      .then((appointments) => {
        Appointment.count({
          userId: tokenUser._id,
          date: { $gte: before, $lte: after },
        }).then((result) => {
          res.send({
            allRows: result,
            appointments,
          });
        });
      });
  } else {
    Appointment.find({ userId: tokenUser._id }, [
      "name",
      "date",
      "docName",
      "complaints",
    ])
      .skip(rowsOnPage * currentPage - rowsOnPage)
      .limit(rowsOnPage)
      .then((appointments) => {
        Appointment.count({ userId: tokenUser._id }).then((result) => {
          res.send({
            allRows: result,
            appointments,
          });
        });
      });
  }
};

module.exports.postAppointment = async (req, res) => {
  // #swagger.tags = ['Appointment']
  // #swagger.description = 'вывод записей пользователя'

  /* #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'token',
        required: true,
        type: 'string',
      } */
  /* #swagger.parameters['Appointment'] = {
        in: 'body',
        description: 'new appointment',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/Appointment" }
      } */
  const { body, headers } = req;
  const tokenUser = parseJwt(headers.authorization);
  body["userId"] = tokenUser._id;
  const value = new Appointment(body);

  if (
    body.hasOwnProperty("name") &&
    body.hasOwnProperty("date") &&
    body.hasOwnProperty("docName") &&
    body.hasOwnProperty("userId") &&
    body.hasOwnProperty("complaints") &&
    body.userId.length !== 0 &&
    body.name.length !== 0 &&
    body.date.length !== 0 &&
    body.docName.length !== 0 &&
    body.complaints.length !== 0
  ) {
    value.save().then((result) => {
      Appointment.find({ userId: tokenUser._id }, [
        "name",
        "date",
        "docName",
        "complaints",
      ]).then((result) => res.send({ appointments: result }));
    });
  } else {
    /* #swagger.responses[420] = { 
          description: 'Appointment creation error, not all fields are filled' 
        } */
    res
      .status(420)
      .send("Appointment creation error, not all fields are filled");
  }
};

module.exports.patchAppointment = async (req, res) => {
  // #swagger.tags = ['Appointment']
  // #swagger.description = 'вывод записей пользователя'

  /* #swagger.parameters['AppointmentPatch'] = {
        in: 'body',
        description: 'new appointment',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/AppointmentPatch" }
      } */
  const { body } = req;

  if (body._id) {
    if (
      body.hasOwnProperty("name") &&
      body.hasOwnProperty("date") &&
      body.hasOwnProperty("docName") &&
      body.hasOwnProperty("complaints") &&
      req.headers.hasOwnProperty("authorization") &&
      req.headers.authorization.length !== 0 &&
      body.name.length !== 0 &&
      body.date.length !== 0 &&
      body.docName.length !== 0 &&
      body.complaints.length !== 0
    ) {
      Appointment.updateOne({ _id: body._id }, body)
        .then((result) => res.send("OK"))
        .catch((err) => res.send(err));
    } else {
      /* #swagger.responses[420] = { 
          description: 'Error changes, changed parameters were not transferred' 
        } */
      res
        .status(420)
        .send("Error changes, changed parameters were not transferred");
    }
  } else {
    /* #swagger.responses[425] = { 
          description: 'Error of change, the parameters of which record need to be changed is unknown' 
        } */
    res
      .status(425)
      .send(
        "Error of change, the parameters of which record need to be changed is unknown"
      );
  }
};

module.exports.delAppointment = async (req, res) => {
  // #swagger.tags = ['Appointment']
  // #swagger.description = 'вывод записей пользователя'

  /* #swagger.parameters['query'] = {
        in: 'query',
        description: 'id',
        required: true,
        type: 'string',
      } */
  const { query } = req;
  if (query.id) {
    Appointment.deleteOne({ _id: query.id }).then((result) => res.send("OK"));
  } else {
    /* #swagger.responses[441] = { 
          description: 'Delete error, it is not known which record to delete' 
        } */
    res
      .status(441)
      .send("Delete error, it is not known which record to delete");
  }
};
