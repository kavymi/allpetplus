#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const apps = ['web'];
const outputDir = path.join(process.cwd(), 'bundle-analysis');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🔍 Analyzing bundle sizes...\n');

apps.forEach(app => {
  console.log(`📦 Analyzing ${app}...`);

  try {
    // Build with analyze flag
    execSync(`ANALYZE=true npx nx build ${app} --configuration=production`, {
      stdio: 'inherit',
      env: { ...process.env, ANALYZE: 'true' }
    });

    console.log(`✅ Analysis complete for ${app}\n`);
  } catch (error) {
    console.error(`❌ Failed to analyze ${app}: ${error.message}\n`);
  }
});

console.log(`📊 Bundle analysis complete! Check the ${outputDir} directory for results.`);
