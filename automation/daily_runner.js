#!/usr/bin/env node

/**
 * RenuIQ & Mojipass Daily Autonomous Operations Orchestrator
 * 
 * Routines:
 * 1) Audit renuiq.com links for 404 errors
 * 2) Audit mojipass.com links for 404 errors
 * 3) Auto-heal any detected 404 errors
 * 4) Report Mojipass Shopify app downloads & removals
 * 5) Scan skincare trends & manage RenuIQ blog curation
 * 6) Optimize SEO/AEO based on season, weather, and AI queries
 * 
 * Usage:
 *   node automation/daily_runner.js --all
 *   node automation/daily_runner.js --all --dry-run
 *   node automation/daily_runner.js --audit-links
 *   node automation/daily_runner.js --app-metrics
 *   node automation/daily_runner.js --curate-blog --publish-new
 */

const auditRenuiqLinks = require('./routines/audit_renuiq_links');
const auditMojipassLinks = require('./routines/audit_mojipass_links');
const heal404s = require('./routines/heal_404');
const reportAppMetrics = require('./routines/report_app_metrics');
const curateBlogTrend = require('./routines/curate_blog_trend');
const optimizeSeoAeo = require('./routines/optimize_seo_aeo');
const sendWeeklyDigest = require('./routines/send_weekly_digest');
const emailDispatcher = require('./core/email_dispatcher');
const reporter = require('./core/reporter');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, val] = arg.replace(/^--/, '').split('=');
      options[key] = val !== undefined ? val : true;
    }
  });
  return options;
}

async function runDailyOperations() {
  const options = parseArgs();

  // If exclusively running weekly digest
  if (options['weekly-digest']) {
    return await sendWeeklyDigest({
      to: options['to']
    });
  }

  const runAll = options.all || Object.keys(options).length === 0;
  const dryRun = Boolean(options['dry-run']);

  console.log('======================================================');
  console.log('🚀 Launching RenuIQ & Mojipass Daily Operations Suite');
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log(`🛠️ Mode: ${dryRun ? 'DRY-RUN (Simulated Actions)' : 'LIVE EXECUTION'}`);
  console.log('======================================================\n');

  const reportData = {};

  // Routine 1: Audit renuiq.com links
  if (runAll || options['audit-links'] || options['renuiq-links']) {
    try {
      reportData.renuiqLinks = await auditRenuiqLinks({ concurrency: 6 });
    } catch (err) {
      console.error('❌ Error in Routine 1 (renuiq.com audit):', err.message);
      reportData.renuiqLinks = { auditedCount: 0, broken: [], error: err.message };
    }
  }

  // Routine 2: Audit mojipass.com links
  if (runAll || options['audit-links'] || options['mojipass-links']) {
    try {
      reportData.mojipassLinks = await auditMojipassLinks({ concurrency: 4 });
    } catch (err) {
      console.error('❌ Error in Routine 2 (mojipass.com audit):', err.message);
      reportData.mojipassLinks = { auditedCount: 0, broken: [], error: err.message };
    }
  }

  // Routine 3: Auto-heal 404s
  if (runAll || options['heal-404']) {
    const allBroken = [
      ...(reportData.renuiqLinks?.broken || []),
      ...(reportData.mojipassLinks?.broken || [])
    ];
    try {
      reportData.healed404s = await heal404s(allBroken, dryRun);
    } catch (err) {
      console.error('❌ Error in Routine 3 (404 healer):', err.message);
      reportData.healed404s = [];
    }
  }

  // Routine 4: Report app downloads & removals
  if (runAll || options['app-metrics']) {
    try {
      reportData.appMetrics = await reportAppMetrics();
    } catch (err) {
      console.error('❌ Error in Routine 4 (app metrics):', err.message);
    }
  }

  // Routine 5: Scan trends & curate blog
  if (runAll || options['curate-blog']) {
    try {
      reportData.blogCuration = await curateBlogTrend({
        dryRun,
        publishNew: Boolean(options['publish-new'])
      });
    } catch (err) {
      console.error('❌ Error in Routine 5 (blog trend):', err.message);
    }
  }

  // Routine 6: Optimize SEO / AEO
  if (runAll || options['optimize-seo']) {
    try {
      reportData.seoAeo = await optimizeSeoAeo();
    } catch (err) {
      console.error('❌ Error in Routine 6 (SEO/AEO):', err.message);
    }
  }

  // Generate Executive Report
  console.log('\n======================================================');
  console.log('📝 Generating Executive Operations Summary...');
  console.log('======================================================');

  const { markdown, logPath } = reporter.generateExecutiveReport(reportData);
  console.log(`\nReport successfully saved to: ${logPath}\n`);
  console.log(markdown);

  if (options.email) {
    try {
      console.log('📧 Dispatching executive report via email...');
      await emailDispatcher.sendWeeklyDigest({
        to: options.to || config.email.to,
        subject: `🛡️ [Daily Operations] RenuIQ & Mojipass Executive Report — ${reporter.getTodayString()}`,
        text: markdown,
        html: null
      });
    } catch (e) {
      console.warn('⚠️ Email dispatch skipped or encountered issue:', e.message);
    }
  }

  console.log('======================================================');
  console.log('🎉 Daily Operations Completed Successfully!');
  console.log('======================================================');
}

runDailyOperations().catch(err => {
  console.error('Fatal error in daily runner:', err);
  process.exit(1);
});
