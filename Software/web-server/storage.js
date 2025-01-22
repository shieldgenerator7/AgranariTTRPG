
//2025-01-21: copied from https://stackoverflow.com/a/77181535/2336212
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const REGION = "us-east-1";

let s3 = new S3Client({ region: REGION });

const BUCKET_NAME = "agranari-characters";



export function getCharacterNameList() {
    return [];
}

export async function storeCharacter(character) {
    //2025-01-21: copied from https://stackoverflow.com/a/77181535/2336212
    const params = getParams(character);
    // Create an object and upload it to the Amazon S3 bucket.
    try {
        const results = await s3.send(new PutObjectCommand(params));
        console.log(
            "Successfully created " +
            params.Key +
            " and uploaded it to " +
            params.Bucket +
            "/" +
            params.Key
        );
        return results; // For unit tests.
    } catch (err) {
        console.log("Error", err);
    }
}

export function loadCharacter(characterName) {
    return {};
}

function getKey(characterName) {
    return `${characterName}.json`;
}
function getParams(character) {
    return {
        Bucket: BUCKET_NAME,
        Key: getKey(character.name),
        Body: JSON.stringify(character),
    };
}