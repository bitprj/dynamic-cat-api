const { BlobServiceClient } = require("@azure/storage-blob");
const Jimp = require('jimp');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // get text from route parameter
    var text = context.bindingData.text;

    const buffer = await getImageFromStorage();
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
 
    const image = await Jimp.read(buffer).then(img => {
        return img.scaleToFit(600,600)
    }).then(img=>{
        return img
        .print(font,0,0, {
            text: text,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
          },
          img.bitmap.width,
          img.bitmap.height)
        .getBufferAsync(Jimp.MIME_JPEG);  
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