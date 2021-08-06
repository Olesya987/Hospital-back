const Appointment = require("../../DB/models/hospital/appointments");

module.exports.getAppointment = (req, res) => {
  Appointment.find().then((result) => res.send({ appointments: result }));
};

module.exports.postAppointment = async (req, res) => {
  const { body } = req;
  const value = new Appointment(body);
  if (
    value.hasOwnProperty("name") &&
    value.hasOwnProperty("date") &&
    value.hasOwnProperty("docName") &&
    value.name.length != 0 &&
    value.date.length != 0 &&
    value.docName.length != 0
  ) {
    value
      .save()
      .then((result) => {
        Appointment.find().then((result) => res.send({ appointments: result }));
      })
      .catch((err) => res.send(err));
  } else {
    res.send("Appointment creation error, not all fields are filled");
  }
};

// module.exports.patchSpend = async (req, res) => {
//   const { body } = req;
//   if (body._id) {
//     if (body.where || body.date || body.howMuch) {
//       Outlay.updateOne({ _id: body._id }, body)
//         .then((result) => {
//           Outlay.find().then((result) => res.send({ costs: result }));
//         })
//         .catch((err) => res.send(err));
//     } else {
//       res.send("Error changes, changed parameters were not transferred");
//     }
//   } else {
//     res.send(
//       "Error of change, the parameters of which record need to be changed is unknown"
//     );
//   }
// };

module.exports.delAppointment = async (req, res) => {
  const { query } = req;
  if (query.id) {
    Appointment.deleteOne({ _id: query.id })
      .then((result) => {
        Appointment.find().then((result) => res.send({ costs: result }));
      })
      .catch((err) => res.send(err));
  } else {
    res.send("Delete error, it is not known which record to delete");
  }
};
