var fetch = require('node-fetch');
module.exports = (req, res) => {
  if (!req.query.q) {
    res.status(400).send(`Please a query to search.  Server recieved a query of ${req.query.q}.`);
  } else {
    let query = req.query.q;
    let offset = req.query.offset || 0;
    fetch('https://api.qwant.com/api/search/web?count=10&q=site:scratch.mit.edu%20' + query + '&t=site:scratch.mit.edu%20' + query + '&f=&offset=' + offset + '&locale=en_us&uiv=4')
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error(`Qwant wants us to slow down - ${response.status}.`);
          res.status(429).send(`Please allow a cooldown period: ${response.status}.`);
          return;
        }
      })
      .then((data) => {
        if (data) {
          if (data.status == "success") {
            res.json(data.data.result.items);
          } else {
            res.status(500).send(`There was an issue with the server.  Try again later.`);
          }
        } else {
          try {
            res.status(500).send(`There was an issue with the server.  Try again later.`);
          } catch {}

        }
      })
  }
}