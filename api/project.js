var fetch = require('node-fetch');
module.exports = (req, res) => {
  let supportedModes = ["popular", "trending", "recent"];
  let offset = req.query.commentoffset || 0;
  let id = req.query.id || undefined;
  let returnComments = req.query.comments.toLowerCase() == "true" ? true : false;
  console.log(`Returning comments: ${returnComments}`)
  if (id) {
    fetch(`https://api.scratch.mit.edu/projects/${id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          res.status(500).send(`There was an issue with the server: ${response.status}.`);
        }
      })
      .then((data) => {
        if (!returnComments) {
          res.json(data);
        } else {
          fetch(`https://api.scratch.mit.edu/users/${data.author.username}/projects/${id}/comments?offset=${offset}&limit=20`)
            .then((response2) => {
              if (response2.ok) {
                return response2.json();
              } else {
                res.status(500).send(`There was an issue with the server: ${response2.status}.`);
              }
            })
            .then((data2) => {
              res.json(data2);
            })
        }
      })
  } else {
    res.status(400).send(`The id query is required, but recieved a value of ${id}.`);
  }
}