var fetch = require('node-fetch');
module.exports = (req, res) => {
  let handler = async () => {
    const response = await fetch("https://scratch.mit.edu/csrf_token/", {
      headers: {
        "x-requested-with": "XMLHttpRequest",
        "Cookie": "scratchcsrftoken=a;scratchlanguage=en;",
        "referer": "https://scratch.mit.edu"
      }
    })
    const status = response.status;
    if (status == 200) {
      let csrf = response.headers.get("set-cookie").match(/(scratchcsrftoken=)\w+/)[0];
      csrf = csrf.split("=")[1];
      res.send(csrf);
      return 0;
    } else {
      res.status(status).send(`Error ${response.statusText}`);
      return 1;
    }
  }

  handler();
}