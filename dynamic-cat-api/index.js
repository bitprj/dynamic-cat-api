const fetch = require("node-fetch");
const fs = require('fs');
const path = require('path');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // get text from route parameter
    var text = context.bindingData.text;

    // get random cat image url
    const urlResp = await fetch("https://api.thecatapi.com/v1/images/search?limit=1&size=full", {
        method: 'GET',
        headers: {
            'x-api-key': process.env.CAT_KEY
        }
    });
    const url = await urlResp.data[0].url;

    // templating html
    const templateHtml = fs.readFileSync(path.join(__dirname, 'templates.html'), 'utf8');
    const image = await nodeHtmlToImage({
        html: templateHtml,
        content: {
            text: text,
            catUrl: url
        }
      });

    context.res = {
        // status: 200, /* Defaults to 200 */
        header: { "content-type": "image/png" },
        body: image
    };
}