const { Client } = require("@elastic/elasticsearch");
require("dotenv").config();

const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: process.env.USER_NAME,
    password: process.env.PASS,
  },
  tls: {
    ca: process.env.CERT,
    rejectUnauthorized: false,
  },
});

client.ping({}, (err, response) => {
  if (err) {
    console.error("Elasticsearch cluster is down!", err);
  } else {
    console.log("Elasticsearch is up!", response);
  }
});

const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.post("/api/search", async (req, res) => {
  const query = req.body.search;
  const isVegan=req.body.isVegan;

  try {
    const result = await client.search({
      index: "food-data",
      body: {
        query: {
          bool: {
            should: [
              {
                match: {
                  strFood: {
                    query: query.toLowerCase(),
                    operator: "or",
                  },
                },
              },
              {
                match: {
                  strDescription: {
                    query: query.toLowerCase(),
                    operator: "or",
                  },
                },
              },
              {
                match: {
                  strIngredient1: {
                    query: query.toLowerCase(),
                    operator: "or",
                  },
                },
              },
              {
                match: {
                  strInstructions: {
                    query: query.toLowerCase(),
                    operator: "or",
                  },
                },
              },
              {
                match: {
                  strMeasure1: {
                    query: query.toLowerCase(),
                    operator: "or",
                  },
                },
              },
              {
                match: {
                  strCalories: {
                    query: query.toLowerCase(),
                    operator: "or",
                  },
                },
              },
              {
                match: {
                  strNutrition1: {
                    query: query.toLowerCase(),
                    operator: "or",
                  },
                },
              },
              {
                match: {
                  strAmount1: {
                    query: query.toLowerCase(),
                    operator: "or",
                  },
                },
              },
              {
                match: {
                  boolVegan: {
                    query: isVegan,
                    operator: "and",
                  },
                },
              },
            ],
          },
        },
      },
    });

    res.json({data:result.hits.hits});
  } catch (error) {
    console.error("Elasticsearch query error:", error);
    res
      .status(500)
      .json({ message: "Error querying Elasticsearch", error: error.message });
  }
});

app.listen(process.env.PORT, function () {
  console.log(`Listening on port ${process.env.PORT}`);
});
