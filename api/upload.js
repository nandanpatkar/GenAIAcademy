import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const config = {
  api: {
    bodyParser: false, // We need raw binary data
  },
};

// Helper: read raw body from request stream
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  // Allow CORS for local dev
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "x-file-name, content-type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const fileName = decodeURIComponent(req.headers["x-file-name"]) || `upload-${Date.now()}`;
    const contentType = req.headers["content-type"] || "application/octet-stream";

    // Read the raw file buffer
    const fileBuffer = await getRawBody(req);

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const key = `uploads/${Date.now()}-${fileName}`;

    // Upload to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      })
    );

    // Return the public S3 URL
    const url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return res.status(200).json({ url });
  } catch (err) {
    console.error("S3 Upload Error:", err);
    return res.status(500).json({ error: "Upload failed", details: err.message });
  }
}