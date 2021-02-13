var fetch = require('node-fetch');
module.exports = (req, res) => {
  let offset = req.query.offset || 0;
  let username = req.query.user || undefined;
  let token = req.query.token || undefined;
  let returnComments = req.query.count == "true" ? true : false;
  console.log(`Returning only count: ${returnComments}`);
  if (username) {
    fetch(`https://api.scratch.mit.edu/users/${username}/messages?offset=${offset}`, {
        headers: {
          "x-requested-with": "XMLHttpRequest",
          "origin": "https://scratch.mit.edu/",
          "referer": `https://scratch.mit.edu/`,
          "x-token": token
        }
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(response.statusText)
          res.status(500).send(`There was an issue with the server: ${response.status}.`);
        }
      })
      .then((data) => {
        if (!returnComments) {
          res.json(data);
        }
      });
  }
}