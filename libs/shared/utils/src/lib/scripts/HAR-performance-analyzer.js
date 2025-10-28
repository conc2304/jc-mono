#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

class HARAnalyzer {
  constructor(harFilePath) {
    this.harFilePath = harFilePath;
    this.harData = null;
  }

  loadHARFile() {
    try {
      const fileContent = fs.readFileSync(this.harFilePath, 'utf8');
      this.harData = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading HAR file:', error);
      process.exit(1);
    }
  }

  analyzePerformance() {
    if (!this.harData) {
      console.error('HAR file not loaded. Call loadHARFile() first.');
      return null;
    }

    const entries = this.harData.log.entries;

    // Performance Analysis Report
    const report = {
      summary: {
        totalRequests: entries.length,
        totalSize: 0,
        slowestRequests: [],
        failedRequests: [],
        renderBlockingResources: [],
        largeResources: [],
      },
      insights: [],
    };

    // Analyze each network request
    entries.forEach((entry) => {
      const request = entry.request;
      const response = entry.response;

      // Calculate total size
      const responseSize = response.content.size || 0;
      report.summary.totalSize += responseSize;

      // Track slow requests (over 500ms)
      const totalTime = entry.time;
      if (totalTime > 500) {
        report.summary.slowestRequests.push({
          url: request.url,
          method: request.method,
          time: totalTime,
          status: response.status,
        });
      }

      // Track failed requests
      if (response.status >= 400) {
        report.summary.failedRequests.push({
          url: request.url,
          status: response.status,
          method: request.method,
        });
      }

      // Identify large resources (over 100KB)
      const sizeInKB = responseSize / 1024;
      if (sizeInKB > 100) {
        report.summary.largeResources.push({
          url: request.url,
          sizeKB: sizeInKB.toFixed(2),
          type: response.content.mimeType,
        });
      }

      // Detect potential render-blocking resources
      const isRenderBlocking = this.isRenderBlockingResource(request, response);
      if (isRenderBlocking) {
        report.summary.renderBlockingResources.push({
          url: request.url,
          type: response.content.mimeType,
        });
      }
    });

    // Generate performance insights
    this.generateInsights(report);

    return report;
  }

  isRenderBlockingResource(request, response) {
    const url = request.url.toLowerCase();
    const mimeType = response.content.mimeType || '';

    // Check for typical render-blocking resources
    const blockingPatterns = [
      // JavaScript files
      /\.js$/,
      // CSS files
      /\.css$/,
      // Font files
      /\.(woff|woff2|ttf|eot)$/,
    ];

    // Check if the resource matches blocking patterns
    return (
      blockingPatterns.some((pattern) => pattern.test(url)) ||
      mimeType.includes('javascript') ||
      mimeType.includes('css')
    );
  }

  generateInsights(report) {
    // Performance Recommendations
    const insights = report.insights;

    // Request Volume Insight
    if (report.summary.totalRequests > 50) {
      insights.push({
        type: 'warning',
        message: `High number of requests (${report.summary.totalRequests}). Consider reducing network requests.`,
        recommendations: [
          'Combine and minify JS and CSS files',
          'Use code splitting',
          'Implement lazy loading',
          'Use HTTP/2 or HTTP/3 for efficient request handling',
        ],
      });
    }

    // Slow Requests Insight
    if (report.summary.slowestRequests.length > 0) {
      insights.push({
        type: 'performance',
        message: `Detected ${report.summary.slowestRequests.length} slow requests`,
        recommendations: [
          'Optimize server response times',
          'Implement caching strategies',
          'Use a CDN for static assets',
          'Minimize external script dependencies',
        ],
      });
    }

    // Failed Requests Insight
    if (report.summary.failedRequests.length > 0) {
      insights.push({
        type: 'error',
        message: `${report.summary.failedRequests.length} requests failed`,
        recommendations: [
          'Check server configurations',
          'Verify resource availability',
          'Implement proper error handling',
          'Review network connectivity',
        ],
      });
    }

    // Large Resources Insight
    if (report.summary.largeResources.length > 0) {
      insights.push({
        type: 'optimization',
        message: `${report.summary.largeResources.length} large resources detected`,
        recommendations: [
          'Compress images',
          'Use WebP or modern image formats',
          'Implement lazy loading for images',
          'Use image and asset optimization tools',
        ],
      });
    }

    // Render-Blocking Resources Insight
    if (report.summary.renderBlockingResources.length > 0) {
      insights.push({
        type: 'critical',
        message: `${report.summary.renderBlockingResources.length} render-blocking resources found`,
        recommendations: [
          'Use async or defer attributes for scripts',
          'Inline critical CSS',
          'Move non-critical CSS to async loading',
          'Use media queries for non-critical CSS',
          'Consider using Web Font Loader',
        ],
      });
    }
  }

  generateReportFile(report) {
    const reportPath = path.join(process.cwd(), 'har-performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`Performance report generated: ${reportPath}`);
    return reportPath;
  }

  // Pretty print the report to console
  printReport(report) {
    console.log('=== HAR Performance Analysis Report ===');
    console.log('\n--- Summary ---');
    console.log(`Total Requests: ${report.summary.totalRequests}`);
    console.log(
      `Total Transfer Size: ${(report.summary.totalSize / 1024 / 1024).toFixed(
        2
      )} MB`
    );

    console.log('\n--- Slow Requests ---');
    report.summary.slowestRequests.forEach((req) => {
      console.log(`- ${req.url} (${req.time}ms)`);
    });

    console.log('\n--- Failed Requests ---');
    report.summary.failedRequests.forEach((req) => {
      console.log(`- ${req.url} (Status: ${req.status})`);
    });

    console.log('\n--- Large Resources ---');
    report.summary.largeResources.forEach((resource) => {
      console.log(`- ${resource.url} (${resource.sizeKB} KB)`);
    });

    console.log('\n--- Render-Blocking Resources ---');
    report.summary.renderBlockingResources.forEach((resource) => {
      console.log(`- ${resource.url}`);
    });

    console.log('\n--- Performance Insights ---');
    report.insights.forEach((insight, index) => {
      console.log(`\nInsight #${index + 1} (${insight.type.toUpperCase()})`);
      console.log(`Message: ${insight.message}`);
      console.log('Recommendations:');
      insight.recommendations.forEach((rec) => {
        console.log(`- ${rec}`);
      });
    });
  }
}

// CLI Functionality
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node har-analyzer.mjs <path_to_har_file>');
    process.exit(1);
  }

  const harFilePath = args[0];

  if (!fs.existsSync(harFilePath)) {
    console.error(`HAR file not found: ${harFilePath}`);
    process.exit(1);
  }

  const analyzer = new HARAnalyzer(harFilePath);
  analyzer.loadHARFile();
  const report = analyzer.analyzePerformance();

  // Print report to console
  analyzer.printReport(report);

  // Generate report file
  analyzer.generateReportFile(report);
}

// Run main function
main();

export default HARAnalyzer;
