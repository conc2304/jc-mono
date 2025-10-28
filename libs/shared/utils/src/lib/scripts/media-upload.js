import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Debug environment variables
console.log('Environment check:');
console.log('R2_ACCOUNT_ID:', process.env.R2_ACCOUNT_ID || 'MISSING');
console.log('R2_ACCESS_KEY_ID:', process.env.R2_ACCESS_KEY_ID || 'MISSING');
console.log('R2_BUCKET_NAME:', process.env.R2_BUCKET_NAME || 'MISSING');
console.log('Current working directory:', process.cwd());

// Configure R2 with AWS SDK v3
const r2 = new S3Client({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  region: 'auto',
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'portfolio-media';

// Simple upload with progress
async function uploadFile(localPath, r2Path) {
  const fileContent = fs.readFileSync(localPath);
  const fileName = path.basename(localPath);
  const ext = path.extname(fileName).toLowerCase();

  // Basic MIME types
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
  };

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: r2Path,
    Body: fileContent,
    ContentType: mimeTypes[ext] || 'application/octet-stream',
    CacheControl: 'public, max-age=31536000', // 1 year cache
    ContentDisposition: 'inline',
  });

  try {
    await r2.send(command);
    console.log(`✅ ${fileName} → ${r2Path}`);
    return { success: true, path: r2Path };
  } catch (error) {
    console.error(`❌ ${fileName}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Bulk upload directory
async function uploadDirectory(localDir, projectId = null) {
  if (!fs.existsSync(localDir)) {
    console.error(`Directory doesn't exist: ${localDir}`);
    return;
  }

  const files = [];

  // Recursively find all media files
  function scanDirectory(dir, prefix = '') {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath, `${prefix}${item}/`);
      } else {
        // Only upload media files
        const ext = path.extname(item).toLowerCase();
        if (
          [
            '.jpg',
            '.jpeg',
            '.png',
            '.webp',
            '.gif',
            '.mp4',
            '.webm',
            '.mov',
          ].includes(ext)
        ) {
          const r2Path = projectId
            ? `gallery/${projectId}/${prefix}${item}`
            : // ? `projects/${projectId}/${prefix}${item}`
              `${prefix}${item}`;
          files.push({ local: fullPath, r2: r2Path });
        }
      }
    }
  }

  scanDirectory(localDir);
  console.log(`📁 Found ${files.length} media files to upload`);

  // Upload all files
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`[${i + 1}/${files.length}] Uploading ${file.local}...`);
    const result = await uploadFile(file.local, file.r2);
    results.push({ ...result, localPath: file.local, r2Path: file.r2 });

    // Small delay to be nice to the API
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const successful = results.filter((r) => r.success).length;
  console.log(
    `\n🎉 Upload complete: ${successful}/${files.length} files uploaded`
  );

  // Generate helpful output for your JSON file
  console.log('\n📋 R2 paths for your projects.json:');
  results
    .filter((r) => r.success)
    .forEach((r) => {
      const fileName = path.basename(r.localPath);
      console.log(`"${fileName}": "${r.r2Path}",`);
    });

  return results;
}

// Quick project-specific upload
async function uploadProject(projectId, localDir) {
  console.log(`🚀 Uploading project: ${projectId}`);
  console.log(`📂 Source: ${localDir}`);
  console.log(`🪣 Bucket: ${BUCKET_NAME}\n`);

  return await uploadDirectory(localDir, projectId);
}

// CLI usage
const args = process.argv.slice(2);
const command = args[0];

if (command === 'project') {
  const projectId = args[1];
  const localDir = args[2];

  if (!projectId || !localDir) {
    console.log(
      'Usage: node upload-media.js project <project-id> <local-directory>'
    );
    console.log(
      'Example: node upload-media.js project web-app ./my-media/web-app'
    );
    process.exit(1);
  }

  uploadProject(projectId, localDir);
} else if (command === 'bulk') {
  const localDir = args[1];

  if (!localDir) {
    console.log('Usage: node upload-media.js bulk <local-directory>');
    console.log('Example: node upload-media.js bulk ./all-my-media');
    process.exit(1);
  }

  uploadDirectory(localDir);
} else {
  console.log(`
Quick Portfolio Media Uploader

Commands:
  project <id> <dir>    Upload media for a specific project
  bulk <dir>           Upload all media files from directory

Examples:
  node media-upload.js project web-app ./media/web-app
  node media-upload.js project gallery-2024 ./media/gallery
  node media-upload.js bulk ./all-portfolio-media

Environment variables needed:
  R2_ACCOUNT_ID=your-cloudflare-account-id
  R2_ACCESS_KEY_ID=your-access-key
  R2_SECRET_ACCESS_KEY=your-secret-key
  R2_BUCKET_NAME=your-bucket-name
  `);
}
