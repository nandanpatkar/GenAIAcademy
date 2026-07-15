import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { key } = req.query;
  if (!key) {
    return res.status(400).json({ error: "Missing key" });
  }

  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: `editor-blobs/${key}`,
      })
    );

    res.setHeader("Content-Type", response.ContentType || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    const bytes = await response.Body.transformToByteArray();
    const buffer = Buffer.from(bytes);
    return res.status(200).send(buffer);
  } catch (err) {
    console.error("S3 Get Blob Error:", err);
    return res.status(404).end();
  }
}
