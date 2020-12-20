var fetch = require('node-fetch');
module.exports = (req, res) => {
  let page = req.query.page;
  fetch(`https://api.scratch.mit.edu/proxy/featured`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        res.status(500).send(`There was an issue with the server: ${response.status}.`);
      }
    })
    .then((data) => {
      switch (page) {
        case "featured": {
          res.json(data.community_featured_projects);
          break;
        }
        case "toploved": {
          res.json(data.community_most_loved_projects);
          break;
        }
        case "topremixed": {
          res.json(data.community_most_remixed_projects);
          break;
        }
        case "sds": {
          res.json(data.scratch_design_studio);
          break;
        }
        case "curated": {
          res.json(data.curator_top_projects);
          break;
        }
        case "recent": {
          res.json(data.curator_most_recent_projects);
          break;
        }
        default: {
          res.status(400).send(`The page parameter is required, but recieved a value of ${page}`)
        }
      }
    })
}