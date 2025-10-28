#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Convert filename to readable title
 * @param {string} filename - Original filename
 * @returns {string} - Human readable title
 */
function filenameToTitle(filename) {
  // Remove extension
  const nameWithoutExt = path.parse(filename).name;

  return (
    nameWithoutExt
      // Replace hyphens and underscores with spaces
      .replace(/[-_]/g, ' ')
      // Handle camelCase by adding spaces before capital letters
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      // Capitalize first letter of each word
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim()
  );
}

/**
 * Generate portfolio entries for files in a directory
 * @param {string} directoryPath - Path to directory containing images
 * @param {string[]} excludeFiles - Array of filenames to exclude
 * @param {string} outputPath - Path to save the generated JSON
 */
function generatePortfolioEntries(
  directoryPath,
  excludeFiles = [],
  outputPath = null
) {
  try {
    // Check if directory exists
    if (!fs.existsSync(directoryPath)) {
      console.error(`❌ Directory does not exist: ${directoryPath}`);
      return;
    }

    // Read all files in directory
    const files = fs.readdirSync(directoryPath);
    const imageFiles = files.filter(
      (file) =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && !excludeFiles.includes(file)
    );

    console.log(
      `📁 Found ${imageFiles.length} image files in ${directoryPath}`
    );
    console.log(`🚫 Excluding ${excludeFiles.length} files`);
    console.log('─'.repeat(80));

    const portfolioEntries = [];

    imageFiles.forEach((filename, index) => {
      const title = filenameToTitle(filename);

      const entry = {
        filename: filename,
        title: title,
        caption: title,
        medium: '',
        categories: ['iOS Made'],
        tags: ['Mobile Art', 'iOS'],
        year: null,
        imageUrl: '',
      };

      portfolioEntries.push(entry);

      console.log(`✅ ${index + 1}. ${filename}`);
      console.log(`   Title: "${title}"`);
      console.log(`   Category: iOS Made`);
      console.log('');
    });

    // Save to file
    const jsonOutput = JSON.stringify(portfolioEntries, null, 2);
    const defaultOutputPath =
      outputPath || path.join(directoryPath, 'new_portfolio_entries.json');

    fs.writeFileSync(defaultOutputPath, jsonOutput);

    console.log('─'.repeat(80));
    console.log(`📊 SUMMARY:`);
    console.log(`   Total new portfolio entries: ${portfolioEntries.length}`);
    console.log(`   JSON saved to: ${defaultOutputPath}`);
    console.log('');
    console.log(`📝 Next steps:`);
    console.log(`   1. Review the generated JSON file`);
    console.log(`   2. Edit titles/tags as needed`);
    console.log(`   3. Merge with your existing portfolio data`);
    console.log(`   4. Run the rename script again with the updated data`);

    return portfolioEntries;
  } catch (error) {
    console.error(`❌ Error processing directory: ${error.message}`);
  }
}

/**
 * Merge new entries with existing portfolio data
 * @param {string} existingDataPath - Path to existing portfolio JSON
 * @param {string} newEntriesPath - Path to new entries JSON
 * @param {string} outputPath - Path to save merged JSON
 */
function mergePortfolioData(existingDataPath, newEntriesPath, outputPath) {
  try {
    console.log(`🔄 Merging portfolio data...`);

    // Read existing data
    const existingData = JSON.parse(fs.readFileSync(existingDataPath, 'utf8'));
    console.log(`📖 Loaded ${existingData.length} existing entries`);

    // Read new entries
    const newEntries = JSON.parse(fs.readFileSync(newEntriesPath, 'utf8'));
    console.log(`📖 Loaded ${newEntries.length} new entries`);

    // Merge arrays
    const mergedData = [...existingData, ...newEntries];

    // Save merged data
    fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));

    console.log(`✅ Merged data saved to: ${outputPath}`);
    console.log(`📊 Total entries: ${mergedData.length}`);

    return mergedData;
  } catch (error) {
    console.error(`❌ Error merging data: ${error.message}`);
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📝 Portfolio JSON Generator

USAGE:
  node generate_portfolio.js <command> [options]

COMMANDS:
  generate <directory>                          Generate JSON for all images in directory
  generate <directory> --exclude-file <path>   Exclude files listed in a text file
  generate <directory> --output <path>         Save JSON to specific path
  merge <existing.json> <new.json> <output>    Merge existing and new portfolio data

EXAMPLES:
  # Generate entries for all images
  node generate_portfolio.js generate ./images

  # Generate entries excluding files listed in exclude.txt
  node generate_portfolio.js generate ./images --exclude-file excluded_files.txt

  # Generate with custom output path
  node generate_portfolio.js generate ./images --output new_entries.json

  # Merge existing portfolio with new entries
  node generate_portfolio.js merge existing_portfolio.json new_entries.json merged_portfolio.json

EXCLUDE FILE FORMAT:
  Create a text file with one filename per line:
  filename1.jpg
  filename2.png
  etc.
`);
    return;
  }

  const command = args[0];

  if (command === 'generate') {
    const directoryPath = args[1];

    if (!directoryPath) {
      console.error('❌ Please provide a directory path');
      return;
    }

    // Parse options
    let excludeFiles = [];
    let outputPath = null;

    const excludeFileIndex = args.indexOf('--exclude-file');
    if (excludeFileIndex !== -1 && excludeFileIndex + 1 < args.length) {
      const excludeFilePath = args[excludeFileIndex + 1];
      try {
        const excludeContent = fs.readFileSync(excludeFilePath, 'utf8');
        excludeFiles = excludeContent
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        console.log(
          `📋 Loaded ${excludeFiles.length} files to exclude from ${excludeFilePath}`
        );
      } catch (error) {
        console.error(`❌ Error reading exclude file: ${error.message}`);
        return;
      }
    }

    const outputIndex = args.indexOf('--output');
    if (outputIndex !== -1 && outputIndex + 1 < args.length) {
      outputPath = args[outputIndex + 1];
    }

    console.log(`📝 Portfolio JSON Generator`);
    console.log(`📁 Directory: ${directoryPath}`);
    if (excludeFiles.length > 0) {
      console.log(`🚫 Excluding: ${excludeFiles.length} files`);
    }
    if (outputPath) {
      console.log(`💾 Output: ${outputPath}`);
    }
    console.log('');

    generatePortfolioEntries(directoryPath, excludeFiles, outputPath);
  } else if (command === 'merge') {
    const [existingPath, newPath, outputPath] = args.slice(1);

    if (!existingPath || !newPath || !outputPath) {
      console.error('❌ Please provide: existing.json new.json output.json');
      return;
    }

    mergePortfolioData(existingPath, newPath, outputPath);
  } else {
    console.error(`❌ Unknown command: ${command}`);
    console.log('Use "generate" or "merge" commands');
  }
}

// Run the script
main();

export { generatePortfolioEntries, mergePortfolioData, filenameToTitle };
