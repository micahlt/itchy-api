var fetch = require('node-fetch');
const html = require('node-html-parser');
const imageToBase64 = require('image-to-base64');
module.exports = async (req, res) => {
  imageToBase64(decodeURI(req.query.url)).then((response) => {
    res.json({
      data: response,
      requested: decodeURI(req.query.url)
    })
  })

}