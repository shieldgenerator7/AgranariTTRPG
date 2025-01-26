//2025-01-25: copied from https://stackoverflow.com/a/77037754/2336212
import * as AWS from "aws-sdk";
console.log("AWS", AWS);
window.AWS = AWS;

//2025-01-25: copied from https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html
var characterBucketName = "sg7-testbucket1";
var bucketRegion = "us-east-1";
var IdentityPoolId = "us-east-1:3272efc3-ef8e-4003-b601-79ca673524b7";

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
  }),
});

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: characterBucketName },
});



export function getCharacterNameList() {
    return [];
}

export async function storeCharacter(character) {
    console.log("storing character to s3", character);

    let characterName = character.name;

    //2025-01-25: copied from https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html
    let characterKey = encodeURIComponent(characterName) + "/" + characterName + ".json";
    let body = JSON.stringify(character);

    // Use S3 ManagedUpload class as it supports multipart uploads
    let upload = new AWS.S3.ManagedUpload({
        params: {
            Bucket: characterBucketName,
            Key: characterKey,
            Body: body,
        },
    });
  
    let promise = upload.promise();
  
    promise.then(
        function (data) {
            alert("Successfully uploaded character.",data);
        },
        function (err) {
            return alert("There was an error uploading your character: ", err.message);
        }
    );
}

export async function loadCharacter(characterName) {
    
    // const params = getParamsGet(characterName);
    // try {
    //     const results = await s3.send(new GetObjectCommand(params));
    //     console.log(
    //         "Successfully retrieved " +
    //         params.Key +
    //         " from " +
    //         params.Bucket +
    //         "/" +
    //         params.Key
    //     );
    //     return results; // For unit tests.
    // } catch (err) {
    //     console.log("Error", err);
    // }
    return {};
}

function getKey(characterName) {
    return `${characterName}.json`;
}
function getParams(character) {
    // return {
    //     Bucket: BUCKET_NAME,
    //     Key: getKey(character.name),
    //     Body: JSON.stringify(character),
    // };
}
function getParamsGet(characterName) {
    // return {
    //     Bucket: BUCKET_NAME,
    //     Key: getKey(characterName),
    // };
}