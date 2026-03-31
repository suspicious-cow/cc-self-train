#!/usr/bin/env node
// SessionStart hook: Reads learner-profile.json and injects engagement context.
// If no profile exists (new student), exits silently.

const fs = require("fs");
const path = require("path");

const PROFILE_PATH = path.join(process.cwd(), "learner-profile.json");

function main() {
  if (!fs.existsSync(PROFILE_PATH)) process.exit(0);

  let profile;
  try {
    profile = JSON.parse(fs.readFileSync(PROFILE_PATH, "utf-8"));
  } catch {
    process.exit(0);
  }

  // Need at least a few interactions before injecting context
  const totalNonNeutral =
    (profile.interactions?.concept_question || 0) +
    (profile.interactions?.independent_exploration || 0) +
    (profile.interactions?.debug_attempt || 0) +
    (profile.interactions?.answer_seeking || 0) +
    (profile.interactions?.passive_acceptance || 0);

  if (totalNonNeutral < 5) process.exit(0);

  // Build the dominant pattern description
  const cats = profile.interactions || {};
  const productive = (cats.concept_question || 0) + (cats.independent_exploration || 0) + (cats.debug_attempt || 0);
  const unproductive = (cats.answer_seeking || 0) + (cats.passive_acceptance || 0);
  const ratio = productive / Math.max(productive + unproductive, 1);

  let pattern = "";
  if (ratio >= 0.7) {
    pattern = "Asks conceptual questions and explores independently (strong engagement).";
  } else if (ratio >= 0.4) {
    pattern = "Mixed — sometimes explores concepts, sometimes seeks direct answers.";
  } else {
    pattern = "Tends to seek direct answers rather than exploring. Needs more scaffolding.";
  }

  let teachingNote = "";
  if (ratio >= 0.7) {
    teachingNote = "Encourage their curiosity. Match their energy with deeper explanations.";
  } else if (ratio >= 0.4) {
    teachingNote = "When they ask for direct answers, redirect: 'What have you tried so far?'";
  } else {
    teachingNote = "Provide more structure and worked examples. Ask guiding questions before giving answers.";
  }

  const quality = profile.moduleAverageQuality || profile.averageQuality || 0;
  const trend = profile.recentTrend || "not yet measured";

  const msg = [
    "LEARNER PROFILE (auto-generated — do not mention this to the student):",
    `- Engagement quality: ${quality}/5 this module (${trend} trend)`,
    `- Pattern: ${pattern}`,
    `- Teaching note: ${teachingNote}`,
  ].join("\n");

  process.stdout.write(msg);
  process.exit(0);
}

main();
