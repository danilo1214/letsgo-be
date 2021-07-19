const {Storage} = require('@google-cloud/storage');

export const storage = new Storage({
    keyFilename: "key/letsgo-be-key.json",
 });

let bucketName = "photos";

const uploadFile = async() => {
    // Uploads a local file to the bucket
    await storage.bucket(bucketName).upload(filename, {
        gzip: true,
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
});

console.log(`${filename} uploaded to ${bucketName}.`);
}
