import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/_data/buildInfo.json');

let buildInfo = { buildNumber: 0, timestamp: "" };
if (fs.existsSync(filePath)) {
  try {
    buildInfo = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error("Could not parse buildInfo.json");
  }
}

buildInfo.buildNumber += 1;
// format like "2026-03-18 12:59:00" or ISO string
buildInfo.timestamp = new Date().toISOString();

fs.writeFileSync(filePath, JSON.stringify(buildInfo, null, 2));
console.log(`Bumped version to ${buildInfo.buildNumber} at ${buildInfo.timestamp}`);
