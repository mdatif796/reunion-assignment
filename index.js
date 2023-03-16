const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

// setting up mongodb
const db = require("./config/databaseConnection");

app.use("/", require("./routes"));

app.listen(PORT, (err) => {
  if (err) {
    console.log("error in connecting with express server ", err);
    return;
  }
  console.log("express server is successfully listening on port:", PORT);
  return;
});
