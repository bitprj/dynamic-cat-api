const { BlobServiceClient } = require("@azure/storage-blob");
const Jimp = require('jimp');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // get text from route parameter
    var text = context.bindingData.text;
    var color = req.query.color;
    var hexcode = "";
    var size = req.query.size;
    var font;

    // determine font size
    if (size <= 1) {
        font = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);
    } else if (size == 2) {
        font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    } else if (size == 3 || size == undefined) {
        font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    } else if (size == 4) {
        font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    } else {
        font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);
    }

    // determine xor value
    if (color == "green") {
        hexcode = '#00ff00';
    } else if (color == "red") {
        hexcode = '#ff0000';
    } else if (color == "blue") {
        hexcode = '#0000ff'
    } else {
        hexcode = 'ffffff'
    }

    const buffer = await getImageFromStorage();
 
    const image = await Jimp.read(buffer).then(img => {
        return img.scaleToFit(600,600);
    }).then(img=>{
        let textImage = new Jimp(1000,1000, 0x0, (err, textImage) => {  
            //((0x0 = 0 = rgba(0, 0, 0, 0)) = transparent)
            if (err) throw err;
        })
    
    
        textImage.print(font, 0, 0, text);
        textImage.color([{ apply: 'xor', params: [hexcode] }]); 
        img.blit(textImage, img.bitmap.width*0.3, img.bitmap.height*0.05);
        return img.getBufferAsync(Jimp.MIME_JPEG);
    });

    context.res = {
        header: { "content-type": "image/jpg" },
        body: image
    };
}

async function  getImageFromStorage()
{    
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env["BlobStorageConnectionString"]);
    const containerName = "images";
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobs = containerClient.listBlobsFlat();
    
    let files = [];
    for await (const blob of blobs) {
        files.push(blob.name);
    }
    
    const randomBlobName = files[Math.floor(Math.random()*files.length)];
    const blobClient = containerClient.getBlobClient(randomBlobName);
    return blobClient.downloadToBuffer();
}