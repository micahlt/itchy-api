var fetch = require('node-fetch');
module.exports = (req, res) => {
  req.body = JSON.parse(req.body);
  const username = req.body.username;
  const password = req.body.password;
  let handler = async () => {
    console.log(password)
    const response = await fetch("https://scratch.mit.edu/login/", {
      headers: {
        "x-csrftoken": "a",
        "x-requested-with": "XMLHttpRequest",
        "Cookie": "scratchcsrftoken=a;scratchlanguage=en;",
        "referer": "https://scratch.mit.edu"
      },
      body: JSON.stringify({
        username,
        password,
        useMessages: true
      }),
      method: "POST"
    })
    const status = response.status;
    if (status == 200) {
      const session = response.headers.get("set-cookie").match(/\"(.*)\"/g)[0];
      const body = await response.text();
      let json = {};
      json = JSON.parse(body);
      res.json(json);
      return 0;
    } else {
      res.status(status).send(`Error ${response.statusText}`);
      return 1;
    }
  }
  handler();
}