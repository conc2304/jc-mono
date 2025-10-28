import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class BundleAnalyzer {
  constructor(bundleReportPath) {
    /**
     * Initialize the Bundle Analyzer with a bundle report JSON
     *
     * @param {string} bundleReportPath - Path to the bundle report JSON file
     */
    try {
      this.bundleReportPath = bundleReportPath;
      this.bundleReport = JSON.parse(fs.readFileSync(bundleReportPath, 'utf8'));
      this.totalBundleSize = 0;
      this.moduleSizes = {};
    } catch (error) {
      console.error('Error reading bundle report:', error);
      throw error;
    }
  }

  calculateModuleSizes() {
    /**
     * Calculate sizes of individual modules
     *
     * @returns {Object} Dictionary of module names and their sizes
     */
    // Placeholder method - will need customization based on bundle report structure
    const moduleSizes = {};

    // Example implementation (modify based on your actual bundle report)
    if (Array.isArray(this.bundleReport.modules)) {
      this.bundleReport.modules.forEach((module) => {
        moduleSizes[module.name] = module.size || 0;
        this.totalBundleSize += module.size || 0;
      });
    }

    this.moduleSizes = moduleSizes;
    return moduleSizes;
  }

  identifyLargeModules(sizeThresholdKb = 50) {
    /**
     * Identify modules larger than the specified threshold
     *
     * @param {number} sizeThresholdKb - Size threshold in kilobytes
     * @returns {Array} List of large modules with their details
     */
    this.calculateModuleSizes(); // Ensure module sizes are calculated

    const largeModules = Object.entries(this.moduleSizes)
      .filter(([, size]) => size > sizeThresholdKb * 1024)
      .map(([moduleName, moduleSize]) => ({
        name: moduleName,
        sizeKb: moduleSize / 1024,
        recommendation: 'Consider code splitting or lazy loading',
      }));

    return largeModules;
  }

  findDuplicateDependencies() {
    /**
     * Detect duplicate or redundant dependencies
     *
     * @returns {Array} List of duplicate dependencies
     */
    const dependencies = {};
    const duplicateDependencies = [];

    // Example implementation (modify based on your bundle report structure)
    if (Array.isArray(this.bundleReport.modules)) {
      this.bundleReport.modules.forEach((module) => {
        if (module.dependencies) {
          module.dependencies.forEach((dep) => {
            if (dependencies[dep]) {
              duplicateDependencies.push({
                name: dep,
                occurrences: dependencies[dep] + 1,
              });
            } else {
              dependencies[dep] = 1;
            }
          });
        }
      });
    }

    return duplicateDependencies;
  }

  suggestCodeSplitting() {
    /**
     * Generate recommendations for code splitting
     *
     * @returns {Object} Dictionary of optimization recommendations
     */
    const recommendations = {
      largeModules: this.identifyLargeModules(),
      duplicateDependencies: this.findDuplicateDependencies(),
      overallSuggestions: [
        'Consider using dynamic imports for routes',
        'Implement lazy loading for heavy components',
        'Use code splitting techniques like React.lazy() and Suspense',
        'Analyze and remove unused code',
        'Minimize large dependencies',
        'Consider using webpack bundle analyzer for visual insights',
      ],
    };

    return recommendations;
  }

  generateReport(outputPath = null) {
    /**
     * Generate a detailed optimization report
     *
     * @param {string} [outputPath] - Optional path to save the report
     * @returns {Object} Optimization report
     */
    const report = {
      totalBundleSizeKb: this.totalBundleSize / 1024,
      optimizations: this.suggestCodeSplitting(),
    };

    // If no output path is provided, use the original bundle report path
    if (!outputPath) {
      const originalDir = path.dirname(this.bundleReportPath);
      const originalFileName = path.basename(
        this.bundleReportPath,
        path.extname(this.bundleReportPath)
      );
      outputPath = path.join(
        originalDir,
        `${originalFileName}-optimization-report.json`
      );
    } else {
      // If output path is a directory, generate filename in that directory
      if (fs.existsSync(outputPath) && fs.lstatSync(outputPath).isDirectory()) {
        const originalFileName = path.basename(
          this.bundleReportPath,
          path.extname(this.bundleReportPath)
        );
        outputPath = path.join(
          outputPath,
          `${originalFileName}-optimization-report.json`
        );
      }
    }

    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`Optimization report saved to: ${outputPath}`);

    return report;
  }
}

function main(bundleReportPath, outputReportPath = null) {
  /**
   * Main function to run bundle analysis
   *
   * @param {string} bundleReportPath - Path to the bundle report JSON
   * @param {string} [outputReportPath] - Optional path to save optimization report
   */
  try {
    const analyzer = new BundleAnalyzer(bundleReportPath);
    const optimizationReport = analyzer.generateReport(outputReportPath);

    // Print key findings to console
    console.log('Bundle Optimization Report');
    console.log('='.repeat(30));
    console.log(
      `Total Bundle Size: ${optimizationReport.totalBundleSizeKb.toFixed(2)} KB`
    );

    console.log('\nLarge Modules:');
    optimizationReport.optimizations.largeModules.forEach((module) => {
      console.log(`- ${module.name}: ${module.sizeKb.toFixed(2)} KB`);
    });

    console.log('\nDuplicate Dependencies:');
    optimizationReport.optimizations.duplicateDependencies.forEach((dep) => {
      console.log(`- ${dep.name} (${dep.occurrences} occurrences)`);
    });

    console.log('\nCode Splitting Suggestions:');
    optimizationReport.optimizations.overallSuggestions.forEach(
      (suggestion) => {
        console.log(`- ${suggestion}`);
      }
    );

    return optimizationReport;
  } catch (error) {
    console.error('Error analyzing bundle report:', error);
    process.exit(1);
  }
}

// Check if running as a script
const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFilePath) {
  const bundleReportPath = process.argv[2];
  const outputReportPath = process.argv[3];

  if (!bundleReportPath) {
    console.log(
      'Usage: node bundle-analyzer.js <path_to_bundle_report.json> [output_report_path]'
    );
    process.exit(1);
  }

  main(bundleReportPath, outputReportPath);
}

export default BundleAnalyzer;
export { main as analyzeBundleReport };
