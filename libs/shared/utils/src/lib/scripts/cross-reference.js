#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Cross-reference portfolio JSON with images directory and create separate portfolio files
 * @param {string} portfolioJsonPath - Path to the portfolio JSON file
 * @param {string} imagesDirectoryPath - Path to the images directory
 * @param {string} outputDir - Directory to save the results (optional)
 */
function crossReferenceAndSplit(
  portfolioJsonPath,
  imagesDirectoryPath,
  outputDir = null
) {
  try {
    console.log(`🔍 Cross-Referencing Portfolio with Images Directory`);
    console.log(`📄 Portfolio JSON: ${portfolioJsonPath}`);
    console.log(`📁 Images Directory: ${imagesDirectoryPath}`);
    console.log('─'.repeat(80));

    // Check if files/directories exist
    if (!fs.existsSync(portfolioJsonPath)) {
      console.error(
        `❌ Portfolio JSON file does not exist: ${portfolioJsonPath}`
      );
      return;
    }

    if (!fs.existsSync(imagesDirectoryPath)) {
      console.error(
        `❌ Images directory does not exist: ${imagesDirectoryPath}`
      );
      return;
    }

    // Read portfolio data
    const portfolioData = JSON.parse(
      fs.readFileSync(portfolioJsonPath, 'utf8')
    );
    console.log(`📖 Loaded ${portfolioData.length} portfolio entries`);

    // Read images directory
    const allFiles = fs.readdirSync(imagesDirectoryPath);
    const imageFiles = allFiles.filter((file) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    console.log(`📁 Found ${imageFiles.length} image files in directory`);

    // Create lookup set for faster comparison (case-insensitive)
    const imageFilesSet = new Set(imageFiles.map((file) => file.toLowerCase()));

    // Split portfolio data into matches and misses
    const portfolioWithImages = [];
    const portfolioWithoutImages = [];

    portfolioData.forEach((item, index) => {
      if (item.filename && imageFilesSet.has(item.filename.toLowerCase())) {
        portfolioWithImages.push(item);
      } else {
        portfolioWithoutImages.push(item);
      }
    });

    // Set up output directory
    const outputDirectory = outputDir || path.dirname(portfolioJsonPath);

    // Create output filenames
    const withImagesPath = path.join(
      outputDirectory,
      'portfolio_with_images.json'
    );
    const withoutImagesPath = path.join(
      outputDirectory,
      'portfolio_without_images.json'
    );
    const summaryPath = path.join(
      outputDirectory,
      'portfolio_split_summary.json'
    );

    // Save portfolio with matching images
    fs.writeFileSync(
      withImagesPath,
      JSON.stringify(portfolioWithImages, null, 2)
    );
    console.log(
      `✅ PORTFOLIO WITH IMAGES: ${portfolioWithImages.length} entries`
    );
    console.log(`   Saved to: ${withImagesPath}`);

    // Save portfolio without matching images
    fs.writeFileSync(
      withoutImagesPath,
      JSON.stringify(portfolioWithoutImages, null, 2)
    );
    console.log(
      `❌ PORTFOLIO WITHOUT IMAGES: ${portfolioWithoutImages.length} entries`
    );
    console.log(`   Saved to: ${withoutImagesPath}`);

    // Create detailed summary
    const summary = {
      analysis: {
        totalPortfolioEntries: portfolioData.length,
        totalImageFiles: imageFiles.length,
        portfolioWithImages: portfolioWithImages.length,
        portfolioWithoutImages: portfolioWithoutImages.length,
        coveragePercentage: (
          (portfolioWithImages.length / portfolioData.length) *
          100
        ).toFixed(1),
        analysisDate: new Date().toISOString(),
      },
      files: {
        originalPortfolio: portfolioJsonPath,
        imagesDirectory: imagesDirectoryPath,
        portfolioWithImages: withImagesPath,
        portfolioWithoutImages: withoutImagesPath,
      },
      portfolioWithoutImages: portfolioWithoutImages.map((item) => ({
        filename: item.filename,
        title: item.title,
        categories: item.categories,
        imageUrl: item.imageUrl || '',
      })),
      imageFilesNotInPortfolio: imageFiles.filter(
        (file) =>
          !portfolioData.some(
            (item) =>
              item.filename &&
              item.filename.toLowerCase() === file.toLowerCase()
          )
      ),
    };

    // Save summary
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    console.log('');
    console.log('📊 SUMMARY:');
    console.log(`   Original Portfolio Entries: ${portfolioData.length}`);
    console.log(`   Image Files in Directory: ${imageFiles.length}`);
    console.log(`   ✅ Portfolio WITH Images: ${portfolioWithImages.length}`);
    console.log(
      `   ❌ Portfolio WITHOUT Images: ${portfolioWithoutImages.length}`
    );
    console.log(
      `   📈 Coverage: ${summary.analysis.coveragePercentage}% of portfolio has images`
    );
    console.log(
      `   🆕 Images without Portfolio: ${summary.imageFilesNotInPortfolio.length}`
    );

    console.log('');
    console.log('📋 FILES CREATED:');
    console.log(`   📄 Portfolio with Images: ${withImagesPath}`);
    console.log(`   📄 Portfolio without Images: ${withoutImagesPath}`);
    console.log(`   📊 Analysis Summary: ${summaryPath}`);

    // Show some examples of what's missing
    if (portfolioWithoutImages.length > 0) {
      console.log('');
      console.log('🔍 SAMPLE MISSING IMAGES:');
      portfolioWithoutImages.slice(0, 5).forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.filename || 'NO_FILENAME'}`);
        console.log(`      Title: "${item.title}"`);
        console.log(
          `      Categories: ${item.categories?.join(', ') || 'None'}`
        );
        if (item.imageUrl) {
          console.log(`      Original URL: ${item.imageUrl}`);
        }
        console.log('');
      });

      if (portfolioWithoutImages.length > 5) {
        console.log(
          `   ... and ${
            portfolioWithoutImages.length - 5
          } more (see portfolio_without_images.json)`
        );
      }
    }

    if (summary.imageFilesNotInPortfolio.length > 0) {
      console.log('');
      console.log('🆕 SAMPLE IMAGES WITHOUT PORTFOLIO:');
      summary.imageFilesNotInPortfolio.slice(0, 5).forEach((filename, i) => {
        console.log(`   ${i + 1}. ${filename}`);
      });

      if (summary.imageFilesNotInPortfolio.length > 5) {
        console.log(
          `   ... and ${summary.imageFilesNotInPortfolio.length - 5} more`
        );
      }
    }

    console.log('');
    console.log('💡 NEXT STEPS:');
    console.log(`   • Use portfolio_with_images.json for your working gallery`);
    console.log(
      `   • Use portfolio_without_images.json to download missing images`
    );
    if (summary.imageFilesNotInPortfolio.length > 0) {
      console.log(
        `   • Create portfolio entries for ${summary.imageFilesNotInPortfolio.length} orphaned images`
      );
    }

    return summary;
  } catch (error) {
    console.error(`❌ Error during cross-reference: ${error.message}`);
  }
}

/**
 * Generate download list for missing images
 * @param {string} resultsJsonPath - Path to cross-reference results JSON
 * @param {string} outputPath - Path to save download list
 */
function generateDownloadList(resultsJsonPath, outputPath = null) {
  try {
    console.log(`📥 Generating Download List from ${resultsJsonPath}`);

    const results = JSON.parse(fs.readFileSync(resultsJsonPath, 'utf8'));
    const missingImages = results.missingFromImages || [];

    if (missingImages.length === 0) {
      console.log(`✅ No missing images found!`);
      return;
    }

    // Create download list with URLs
    const downloadList = missingImages
      .filter((item) => item.originalImageUrl && item.originalImageUrl.trim())
      .map((item) => ({
        filename: item.filename,
        title: item.title,
        url: item.originalImageUrl,
        downloadCommand: `curl -o "${item.filename}" "${item.originalImageUrl}"`,
      }));

    // Create shell script for downloading
    const shellScript = [
      '#!/bin/bash',
      '# Download missing portfolio images',
      '# Generated on ' + new Date().toISOString(),
      '',
      'echo "Downloading ' + downloadList.length + ' missing images..."',
      'mkdir -p downloaded_images',
      'cd downloaded_images',
      '',
      ...downloadList.map(
        (item) =>
          `echo "Downloading ${item.filename}..."\n${item.downloadCommand}`
      ),
      '',
      'echo "Download complete!"',
    ].join('\n');

    const defaultOutputPath =
      outputPath ||
      path.join(path.dirname(resultsJsonPath), 'download_missing_images.sh');
    const jsonOutputPath = defaultOutputPath.replace('.sh', '.json');

    // Save download list as JSON
    fs.writeFileSync(jsonOutputPath, JSON.stringify(downloadList, null, 2));

    // Save download script
    fs.writeFileSync(defaultOutputPath, shellScript);
    fs.chmodSync(defaultOutputPath, '755'); // Make executable

    console.log(`📋 Download list saved to: ${jsonOutputPath}`);
    console.log(`🔧 Download script saved to: ${defaultOutputPath}`);
    console.log(
      `📊 Found ${downloadList.length} images with URLs out of ${missingImages.length} missing`
    );

    if (downloadList.length > 0) {
      console.log('');
      console.log('🚀 To download missing images, run:');
      console.log(`   chmod +x ${defaultOutputPath}`);
      console.log(`   ./${path.basename(defaultOutputPath)}`);
    }
  } catch (error) {
    console.error(`❌ Error generating download list: ${error.message}`);
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🔍 Portfolio Cross-Reference Tool

USAGE:
  node cross_reference.js <command> [options]

COMMANDS:
  split <portfolio.json> <images_directory>                Create separate JSON files for matches/misses
  split <portfolio.json> <images_directory> --output <dir> Save files to specific directory
  compare <portfolio.json> <images_directory>              Compare portfolio with images (analysis only)
  compare <portfolio.json> <images_directory> --output <path>  Save results to specific file
  download-list <results.json>                             Generate download script for missing images

EXAMPLES:
  # Split portfolio into two files: with images vs without images
  node cross_reference.js split complete_portfolio.json ./images

  # Split and save to specific directory
  node cross_reference.js split portfolio.json ./images --output ./output

  # Basic cross-reference analysis
  node cross_reference.js compare complete_portfolio.json ./images

  # Generate download script for missing images
  node cross_reference.js download-list cross_reference_results.json

WHAT THE SPLIT COMMAND DOES:
  • Creates portfolio_with_images.json (items that have corresponding image files)
  • Creates portfolio_without_images.json (items that need images downloaded)
  • Creates portfolio_split_summary.json (detailed analysis and stats)
  • Shows coverage statistics and recommendations
`);
    return;
  }

  const command = args[0];

  if (command === 'split') {
    const [portfolioPath, imagesPath] = args.slice(1);

    if (!portfolioPath || !imagesPath) {
      console.error('❌ Please provide: <portfolio.json> <images_directory>');
      return;
    }

    let outputDir = null;
    const outputIndex = args.indexOf('--output');
    if (outputIndex !== -1 && outputIndex + 1 < args.length) {
      outputDir = args[outputIndex + 1];
    }

    crossReferenceAndSplit(portfolioPath, imagesPath, outputDir);
  } else if (command === 'compare') {
    const [portfolioPath, imagesPath] = args.slice(1);

    if (!portfolioPath || !imagesPath) {
      console.error('❌ Please provide: <portfolio.json> <images_directory>');
      return;
    }

    let outputPath = null;
    const outputIndex = args.indexOf('--output');
    if (outputIndex !== -1 && outputIndex + 1 < args.length) {
      outputPath = args[outputIndex + 1];
    }

    crossReferenceFiles(portfolioPath, imagesPath, outputPath);
  } else if (command === 'download-list') {
    const resultsPath = args[1];

    if (!resultsPath) {
      console.error('❌ Please provide path to cross-reference results JSON');
      return;
    }

    generateDownloadList(resultsPath);
  } else {
    console.error(`❌ Unknown command: ${command}`);
    console.log('Use "split", "compare", or "download-list" commands');
  }
}

// Run the script
main();

// export { crossReferenceFiles, crossReferenceAndSplit, generateDownloadList };
