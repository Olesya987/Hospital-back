const User = require("../../DB/models/hospital/users");

// module.exports.getSpend = async (req, res) => {
//   Outlay.find().then((result) => res.send({ costs: result }));
// };

// module.exports.postSpend = async (req, res) => {
//   const { body } = req;
//   const value = new Outlay(body);
//   if (value.where && value.date && value.howMuch) {
//     value
//       .save()
//       .then((result) => {
//         Outlay.find().then((result) => res.send({ costs: result }));
//       })
//       .catch((err) => res.send(err));
//   } else {
//     res.send("User creation error, not all fields are filled");
//   }
// };

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

// module.exports.delSpend = async (req, res) => {
//   const { query } = req;
//   if(query.id){
//     Outlay.deleteOne({ _id: query.id })
//     .then((result) => {
//       Outlay.find().then((result) => res.send({ costs: result }));
//     })
//     .catch((err) => res.send(err));
//   } else {
//     res.send('Delete error, it is not known which record to delete');
//   }
// };
