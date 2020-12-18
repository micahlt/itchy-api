var fetch = require('node-fetch');
module.exports = (req, res) => {
  let supportedModes = ["popular", "trending", "recent"];
  let offset = req.query.offset || 0;
  let tag = req.query.tag ? `&q=${req.query.tag}` : "";
  let mode = req.query.mode;
  if (!supportedModes.includes(mode)) {
    mode = "popular";
  }
  fetch(`https://api.scratch.mit.edu/explore/projects?&offset=${offset}&limit=20&mode=${mode}${tag}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        res.status(500).send(`There was an issue with the server: ${response.status}.`);
      }
    })
    .then((data) => {
      res.json(data);
    })
}