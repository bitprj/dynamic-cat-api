const fetch = require("node-fetch");


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
    const url = await urlResp.data[0];

    // get random cat image
    const imageResp = await fetch(url, {
        method: 'GET'
    });
    const data = await imageResp.arrayBuffer();

    const base64Image = Buffer.from(data).toString('base64');


    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}