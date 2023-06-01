const PORT = process.env.PORT || 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();

const airports = [];

const icaos = [
  {
    adress: "LTCW",
  },
  {
    adress: "LTDA",
  },
  {
    adress: "LTCI",
  },
  {
    adress: "LTCJ",
  },
  {
    adress: "LTBJ",
  },
  {
    adress: "LTCT",
  },
  {
    adress: "LTCS",
  },
  {
    adress: "LTAJ",
  },
  {
    adress: "LTCV",
  },
  {
    adress: "LTBU",
  },
];

icaos.forEach((icao) => {
  axios
    .get(
      `https://rasat.mgm.gov.tr/result?stations=${icao.adress}&obsType=1&obsType=2&hours=0`
    )
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const selector = "#resultDD > div.result-table-title";
      const metarSelec = 'pre:contains("METAR")';
      const tafSelec = 'pre:contains("TAF")';
      $(selector && metarSelec && tafSelec, html).each(function () {
        const title = $(selector).text();
        const metar = $(metarSelec).text();
        const taf = $(tafSelec).text();
        airports.push({ title, metar, taf });
      });
    })
    .catch((err) => console.log(err));
});

app.get("/", function (req, res) {
  res.send(
    airports
      .map(
        (airport) =>
          `<div> <h2>${airport.title}</h2>
      <p>${airport.metar}</p>
      <p>${airport.taf}</p>
      </div> 
      `
      )
      .join("")
  );
});

app.get("/icaos", function (req, res) {
  res.json(airports);
});

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
