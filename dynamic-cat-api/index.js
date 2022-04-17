const nodeHtmlToImage = require('node-html-to-image');
const cats = require("cats-js")
const fs = require('fs');
const path = require('path');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // get text from route parameter
    var text = context.bindingData.text;

    // get random cat image url
    const c = new cats();
    const catObj = await c.get()
    const url = catObj.images.image.url;
    context.log(url)

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