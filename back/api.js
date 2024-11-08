const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.post("/search", (req, res, next) => {
  let search = req.body.search.search;
  let string=[]
  for(let i=0;i<10;i++){
    string[i]=`${search}${i}`;
  }
  console.log(search);
  res.json({
    data: string,
  });
});

app.listen(process.env.PORT, function () {
  console.log(`Listening on port ${process.env.PORT}`);
});
