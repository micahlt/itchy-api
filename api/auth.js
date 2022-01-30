var fetch = require("node-fetch");
module.exports = (req, res) => {
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        useMessages: true,
        username,
        password,
      }),
    });
    const status = response.status;
    if (status == 200) {
      const session = {
        session: response.headers.get("set-cookie").match(/\"(.*)\"/g)[0],
      };
      let body = await response.text();
      body = JSON.parse(body)[0];
      let json = {
        ...body,
        ...session,
      };
      res.json(json);
      return 0;
    } else {
      console.log(response, "<- Response");
      res.status(status).send(`Error ${response.statusText}`);
      return 1;
    }
  };
  handler();
};
