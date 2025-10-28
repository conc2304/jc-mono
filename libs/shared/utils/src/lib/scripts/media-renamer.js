#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import { portfolioData } from './portfolio-data_ORIG.js';

console.log('Media Renamer Top');
// ES module equivalent of __dirname

/**
 * Clean filename for file system compatibility
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text safe for filenames
 */
function cleanFilename(text) {
  return text
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
    .replace(/[–—]/g, '-') // Replace em/en dashes with hyphens
    .replace(/'/g, '') // Remove apostrophes
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 200); // Limit length to avoid filesystem issues
}

/**
 * Generate new filename from title and category
 * @param {Object} item - Portfolio item
 * @param {string} originalExt - Original file extension
 * @returns {string} - New filename
 */
function generateNewFilename(item, originalExt) {
  // Clean the title
  let cleanTitle = cleanFilename(item.title);

  // Handle empty titles
  if (!cleanTitle) {
    cleanTitle = 'Untitled';
  }

  // Get primary category (first one if multiple)
  const category =
    item.categories.length > 0
      ? cleanFilename(item.categories[0])
      : 'Uncategorized';

  // Format: Category_Title.ext
  return `${category}_${cleanTitle}${originalExt}`;
}

/**
 * Rename files in a directory based on portfolio data
 * @param {string} directoryPath - Path to the directory containing images
 * @param {boolean} dryRun - If true, only log what would be renamed without actually renaming
 * @param {string} outputDataPath - Path to save updated portfolio data (optional)
 */
function renamePortfolioImages(
  directoryPath,
  dryRun = true,
  outputDataPath = null
) {
  try {
    // Check if directory exists
    if (!fs.existsSync(directoryPath)) {
      console.error(`❌ Directory does not exist: ${directoryPath}`);
      return;
    }

    // Read all files in directory
    const files = fs.readdirSync(directoryPath);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    console.log(
      `📁 Found ${imageFiles.length} image files in ${directoryPath}`
    );
    console.log(`🔍 Looking up ${portfolioData.length} portfolio items`);
    console.log(
      `${
        dryRun
          ? '🧪 DRY RUN MODE - No files will be renamed'
          : '🚀 RENAMING FILES'
      }`
    );
    console.log('─'.repeat(80));

    let matchedCount = 0;
    let renamedCount = 0;
    const renameLog = [];
    const updatedPortfolioData = [...portfolioData]; // Create a copy to modify

    // Create a lookup map for faster searching
    const portfolioMap = new Map();
    portfolioData.forEach((item, index) => {
      if (item.filename) {
        portfolioMap.set(item.filename.toLowerCase(), { item, index });
      }
    });

    // Process each image file
    imageFiles.forEach((filename) => {
      const lowercaseFilename = filename.toLowerCase();
      const portfolioMatch = portfolioMap.get(lowercaseFilename);

      if (portfolioMatch) {
        const { item: portfolioItem, index: portfolioIndex } = portfolioMatch;
        matchedCount++;

        const fileExt = path.extname(filename);
        const newFilename = generateNewFilename(portfolioItem, fileExt);
        const oldPath = path.join(directoryPath, filename);
        const newPath = path.join(directoryPath, newFilename);

        console.log(`✅ MATCH: ${filename}`);
        console.log(`   Title: ${portfolioItem.title}`);
        console.log(`   Category: ${portfolioItem.categories.join(', ')}`);
        console.log(`   Rename: ${filename} → ${newFilename}`);

        renameLog.push({
          original: filename,
          new: newFilename,
          title: portfolioItem.title,
          categories: portfolioItem.categories,
          portfolioIndex: portfolioIndex,
        });

        // Actually rename the file if not in dry run mode
        if (!dryRun) {
          try {
            // Check if target filename already exists
            if (fs.existsSync(newPath) && oldPath !== newPath) {
              console.log(
                `   ⚠️  Warning: Target file already exists, skipping rename`
              );
            } else {
              fs.renameSync(oldPath, newPath);

              // Update the portfolio data with new filename
              updatedPortfolioData[portfolioIndex] = {
                ...updatedPortfolioData[portfolioIndex],
                filename: newFilename,
              };

              renamedCount++;
              console.log(`   ✅ Renamed successfully`);
              console.log(`   📝 Updated portfolio data filename`);
            }
          } catch (error) {
            console.log(`   ❌ Error renaming file: ${error.message}`);
          }
        } else {
          // In dry run mode, still update the copy to show what would change
          updatedPortfolioData[portfolioIndex] = {
            ...updatedPortfolioData[portfolioIndex],
            filename: newFilename,
          };
        }

        console.log('');
      } else {
        console.log(`❌ NO MATCH: ${filename}`);
      }
    });

    // Summary
    console.log('─'.repeat(80));
    console.log(`📊 SUMMARY:`);
    console.log(`   Total image files: ${imageFiles.length}`);
    console.log(`   Matched with portfolio data: ${matchedCount}`);
    console.log(
      `   Successfully renamed: ${dryRun ? 'N/A (dry run)' : renamedCount}`
    );
    console.log(`   Not matched: ${imageFiles.length - matchedCount}`);

    if (dryRun) {
      console.log('');
      console.log('🔄 To actually rename files, run with dryRun = false');
    }

    // Save rename log to file
    if (renameLog.length > 0) {
      const logPath = path.join(directoryPath, 'rename_log.json');
      fs.writeFileSync(logPath, JSON.stringify(renameLog, null, 2));
      console.log(`📝 Rename log saved to: ${logPath}`);
    }

    // Save updated portfolio data if requested or if files were actually renamed
    const shouldSaveData = outputDataPath || (!dryRun && renamedCount > 0);
    if (shouldSaveData && renameLog.length > 0) {
      const dataOutputPath =
        outputDataPath ||
        path.join(directoryPath, 'updated_portfolio_data.json');

      try {
        const updatedDataJson = JSON.stringify(updatedPortfolioData, null, 2);
        fs.writeFileSync(dataOutputPath, updatedDataJson);
        console.log(`💾 Updated portfolio data saved to: ${dataOutputPath}`);

        if (dryRun) {
          console.log(
            `   ℹ️  This shows what the data would look like after renaming`
          );
        } else {
          console.log(
            `   ✅ Portfolio data has been updated with new filenames`
          );
        }
      } catch (error) {
        console.error(`❌ Error saving portfolio data: ${error.message}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory: ${error.message}`);
  }
}

/**
 * Main execution
 */

function main() {
  console.log('RUN MAIN');

  // Get command line arguments
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📁 Portfolio Image Renamer

Usage:
  node rename_images.js <directory_path> [options]

Arguments:
  directory_path    Path to directory containing image files

Options:
  --execute         Actually rename files (default is dry run)
  --output <path>   Save updated portfolio data to specific file
  --save-data       Save updated portfolio data to directory (default in execute mode)

Examples:
  node rename_images.js ./images                           # Dry run
  node rename_images.js ./images --execute                 # Rename files and save updated data
  node rename_images.js ./images --output portfolio.json   # Dry run, save data preview
  node rename_images.js ./images --execute --output ./data/portfolio.json  # Full execution
`);
    return;
  }

  const directoryPath = args[0];
  const execute = args.includes('--execute');
  const saveData = args.includes('--save-data');
  const dryRun = !execute;

  // Handle --output flag
  let outputDataPath = null;
  const outputIndex = args.indexOf('--output');
  if (outputIndex !== -1 && outputIndex + 1 < args.length) {
    outputDataPath = args[outputIndex + 1];
  } else if (saveData || execute) {
    // Default behavior: save to directory if explicitly requested or in execute mode
    outputDataPath = true;
  }

  console.log(`🎨 Portfolio Image Renamer`);
  console.log(`📁 Directory: ${directoryPath}`);
  console.log(`🔧 Mode: ${dryRun ? 'Dry Run' : 'Execute'}`);
  if (outputDataPath) {
    console.log(
      `💾 Portfolio data will be ${
        typeof outputDataPath === 'string'
          ? `saved to: ${outputDataPath}`
          : 'updated'
      }`
    );
  }
  console.log('');

  renamePortfolioImages(
    directoryPath,
    dryRun,
    outputDataPath === true ? null : outputDataPath
  );
}

// Run the script (ES module version)
// if (import.meta.url === `file://${process.argv[1]}`) {
main();
// }

export { renamePortfolioImages, cleanFilename, generateNewFilename };
