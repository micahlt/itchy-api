var fetch = require('node-fetch');
module.exports = (req, res) => {
  req.body = JSON.parse(req.body);
  const username = req.body.username;
  const password = req.body.password;
  let handler = async () => {
    const response = await fetch("https://scratch.mit.edu/accounts/login/", {
      credentials: "include",
      method: "POST",
      headers: {
        Cookie: "scratchcsrftoken=a; scratchlanguage=en",
        "User-Agent": "Firefox",
        Origin: "https://scratch.mit.edu",
        Referer: "https://scratch.mit.edu/",
        "X-CSRFToken": "a",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        useMessages: true,
        username,
        password
      })
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
      console.log(response, '<- Response')
      res.status(status).send(`Error ${response.statusText}`);
      return 1;
    }
  }
  handler();
}