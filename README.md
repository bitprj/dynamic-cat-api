## Simple Cat API
To add on text to a random cat image, pass in your message from the url.
`/cat/says/{YOUR TEXT}`

This will then show a random cat image with your text applied.

### Parameters
#### `?color=`
Currently supports "blue", "red", "green", and a default of white.

#### `?size=`
Currently supports numbers ranging from 1 to 5.

## Running Locally
Images are sourced from blob storage. Add a container named images and set the connection string in to `BlobStorageConnectionString` in your function settings. You can set this in `local.settings.json` to run locally.

```
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "BlobStorageConnectionString":"value-here"
  }
}

```