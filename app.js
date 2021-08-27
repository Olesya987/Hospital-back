const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const apiRoutes = require("./src/modules/routes/routes");
const fileUpload = require("express-fileupload");
const http = require('http');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const app = express();

app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static(__dirname + "/src/source/images"));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/", apiRoutes);

const url =
  "mongodb+srv://user:user@clusterhospital.fv8zu.mongodb.net/Hospital?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

http.createServer(app).listen(8080)
console.log("Listening at:// port:%s (HTTP)", 8080)
// app.listen(8080, () => {
//   console.log("Example app listening on port 8080!");
// });
