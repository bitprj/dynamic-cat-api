const nodeHtmlToImage = require('node-html-to-image');
// const SomeRandomCat = require('some-random-cat').Random;
const fetch = require('node-fetch')
const fs = require('fs');
const path = require('path');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // get text from route parameter
    var text = context.bindingData.text;

    // get random cat image url
    // const catObj = await SomeRandomCat.getCat()
    // const url = catObj.url;
    const urlResp = await fetch("https://api.thecatapi.com/v1/images/search?format=json", {
        method: 'GET',
        headers: {
            'x-api-key': process.env.CAT_KEY
        }
    });
    const catObj = await urlResp.json();
    const url = catObj[0].url;

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