const express = require("express");
const app = express();

app.listen(PORT, (err) => {
  if (err) {
    console.log("error in connecting with express server ", err);
    return;
  }
  console.log("express server is successfully listening on port:", PORT);
  return;
});
