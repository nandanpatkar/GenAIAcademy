import fs from 'fs';
import path from 'path';

const enJsonPath = '/Users/nandanpatkar/Downloads/genai-roadmap-src/AFFiNE/packages/frontend/i18n/src/resources/en.json';

try {
  let content = fs.readFileSync(enJsonPath, 'utf8');

  // Replace occurrences of brand names
  content = content.replace(/AFFiNE Cloud/g, 'Workspace Sync');
  content = content.replace(/AFFiNE Sync/g, 'Workspace Sync');
  content = content.replace(/AFFiNE AI/g, 'Workspace AI');
  content = content.replace(/About AFFiNE/g, 'About Workspace Notes');
  content = content.replace(/AFFiNE/g, 'Workspace Notes');

  fs.writeFileSync(enJsonPath, content, 'utf8');
  console.log('Successfully white-labeled en.json!');
} catch (err) {
  console.error('Error white-labeling en.json:', err);
}
