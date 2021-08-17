const Appointment = require("../../DB/models/hospital/appointments");
const jwt = require("jsonwebtoken");
const appointments = require("../../DB/models/hospital/appointments");

process.env.key = "Derevyanko_Olesya";
const parseJwt = (token) => {
  return jwt.verify(token, process.env.key);
};

module.exports.getPag = (req, res) => {
  const { params } = req;
  const tokenUser = parseJwt(req.headers.authorization);
  const rowsOnPage = +params.rowsOnPage || 5;
  const currentPage = +params.currentPage || 1;

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
};

module.exports.sortAppointment = (req, res) => {
  const { params, body } = req;
  const tokenUser = parseJwt(req.headers.authorization);
  const rowsOnPage = +params.rowsOnPage || 5;
  const currentPage = +params.currentPage || 1;
  const value = body.value;
  const direction = +body.direction;

  Appointment.find({ userId: tokenUser._id }, [
    "name",
    "date",
    "docName",
    "complaints",
  ])
    .sort({ [value]: direction })
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
};

module.exports.postAppointment = async (req, res) => {
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
    res
      .status(420)
      .send("Appointment creation error, not all fields are filled");
  }
};

module.exports.patchAppointment = async (req, res) => {
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
      const tokenUser = parseJwt(req.headers.authorization);

      Appointment.updateOne({ _id: body._id }, body)
        .then((result) => {
          Appointment.find({ userId: tokenUser._id }, [
            "name",
            "date",
            "docName",
            "complaints",
          ]).then((result) => res.send({ appointments: result }));
        })
        .catch((err) => res.send(err));
    } else {
      res
        .status(420)
        .send("Error changes, changed parameters were not transferred");
    }
  } else {
    res
      .status(425)
      .send(
        "Error of change, the parameters of which record need to be changed is unknown"
      );
  }
};

module.exports.delAppointment = async (req, res) => {
  const { query } = req;
  const tokenUser = parseJwt(req.headers.authorization);
  if (query.id) {
    Appointment.deleteOne({ _id: query.id }).then((result) => {
      Appointment.find({ userId: tokenUser._id }, [
        "name",
        "date",
        "docName",
        "complaints",
      ]).then((result) => res.send({ appointments: result }));
    });
  } else {
    res.send("Delete error, it is not known which record to delete");
  }
};
