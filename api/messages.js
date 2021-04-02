var fetch = require('node-fetch');
module.exports = (req, res) => {
  let offset = req.query.offset || 0;
  let username = req.query.user || undefined;
  let token = req.query.token || undefined;
  let returnCount = req.query.count == "true" ? true : false;
  console.log(`Returning only count? ${returnCount}`);
  if (username) {
    if (returnCount) {
      fetch(`https://api.scratch.mit.edu/users/${username}/messages/count`, {
          headers: {
            "x-requested-with": "XMLHttpRequest",
            "origin": "https://scratch.mit.edu/",
            "referer": `https://scratch.mit.edu/`
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
          console.log(data)
          return res.json(data);
        });
    } else {
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
          if (!returnCount) {
            return res.json(data);
          }
        });
    }
  }
}