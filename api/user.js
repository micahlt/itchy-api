var fetch = require('node-fetch');
const html = require('node-html-parser');
module.exports = (req, res) => {
  let offset = req.query.commentoffset || 0;
  let username = req.query.user || undefined;
  let returnComments = req.query.comments == "true" ? true : false;
  console.log(`Returning comments: ${returnComments}`);
  if (username) {
    fetch(`https://api.scratch.mit.edu/users/${username}`)
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
          // res.status(501).send(`Returning user comments has not been implemented.`);
          fetch(`https://scratch.mit.edu/site-api/comments/user/${username}/?page=1`)
            .then((response2) => {
              if (response2.ok) {
                return response2.text();
              } else {
                res.status(500).send(`There was an issue with the server: ${response2.status}.`);
              }
            })
            .then((data2) => {
              let c = html.parse(data2);
              let commentArray = [];
              c.querySelectorAll('li.top-level-reply').forEach((item, i) => {
                if (!item.getAttribute('class').includes('removed')) {
                  let id = item.querySelector('.comment').getAttribute('data-comment-id');
                  let user = item.querySelector('#comment-user').getAttribute('data-comment-user');
                  let content = item.querySelector('.content').innerText.replace(/\s+/g, ' ').trim();
                  let timestamp = item.querySelector('.time').getAttribute('title');
                  let replies = [];
                  if (item.querySelector('.replies').innerHTML.trim() != 0) {
                    item.querySelectorAll('li.reply').forEach((item2, i) => {
                      let id2 = item2.querySelector('.comment').getAttribute('data-comment-id');
                      let user2 = item2.querySelector('#comment-user').getAttribute('data-comment-user');
                      let content2 = item2.querySelector('.content').innerText.replace(/\s+/g, ' ').trim();
                      let timestamp2 = item2.querySelector('.time').getAttribute('title');
                      replies.push({
                        id: id2,
                        user: user2,
                        content: content2,
                        timestamp: timestamp2
                      });
                    });
                  }
                  commentArray.push({
                    id,
                    author: {
                      username: user,
                      image: 'https:' + item.querySelector('.avatar').getAttribute('src')
                    },
                    content,
                    timestamp,
                    replies
                  });
                }
              })
              res.json(commentArray);
            });
        }
      })
  } else {
    res.status(400).send(`The username query is required, but recieved a value of ${username}.`);
  }
}