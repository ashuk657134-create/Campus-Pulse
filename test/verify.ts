// Comprehensive verification suite for Campus Pulse AI
import { parseNoticeLocally } from '../src/services/parser.ts';
import { detectConflicts, detectDuplicates } from '../src/services/conflictDetector.ts';
import { generateWeeklyDigestLocally } from '../src/services/weeklyDigest.ts';
import { INITIAL_DEMO_NOTICES, SAMPLE_INPUT_PRESETS } from '../src/data/sampleNotices.ts';
import { getDeadlineCountdown, formatRelativeDate } from '../src/utils/dateUtils.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n--- 1. Testing Deterministic Local Parser ---');

// Test 1: Assignment extraction
const assignResult = parseNoticeLocally(SAMPLE_INPUT_PRESETS[0].text);
assert(assignResult.category === 'assignment', 'Category identified as assignment');
assert(assignResult.deadline !== null, 'Deadline extracted successfully');
assert(assignResult.parsingMode === 'rule-based', 'Parsing mode marked as rule-based');
assert(assignResult.confidenceScore > 80, `High confidence score: ${assignResult.confidenceScore}%`);

// Test 2: Exam extraction
const examResult = parseNoticeLocally(SAMPLE_INPUT_PRESETS[1].text);
assert(examResult.category === 'exam', 'Category identified as exam');
assert(examResult.eventDate !== null, 'Event commencement date extracted');
assert(examResult.venue !== null && (examResult.venue.toLowerCase().includes('audi') || examResult.venue.toLowerCase().includes('hall')), `Venue detected: ${examResult.venue}`);

// Test 3: Hackathon Event extraction
const eventResult = parseNoticeLocally(SAMPLE_INPUT_PRESETS[2].text);
assert(eventResult.category === 'event', 'Category identified as event');
assert(eventResult.eventDate !== null, 'Event date identified');
assert(eventResult.venue !== null && eventResult.venue.toLowerCase().includes('auditorium'), `Venue identified: ${eventResult.venue}`);

// Test 4: Hinglish Notice extraction
const hinglishResult = parseNoticeLocally(SAMPLE_INPUT_PRESETS[4].text);
assert(hinglishResult.category === 'placement', 'Hinglish placement keyword identified');
assert(hinglishResult.venue !== null && hinglishResult.venue.toLowerCase().includes('seminar hall 1'), `Hinglish venue detected: ${hinglishResult.venue}`);

// Test 5: Ambiguous date format detection (e.g. 05/06/2026)
const ambiguousResult = parseNoticeLocally("Meeting on 05/06/2026 at 2:00 PM in Room 101");
assert(ambiguousResult.hasAmbiguousDate === true, 'Ambiguous date (05/06/2026) correctly flagged for confirmation');
assert(ambiguousResult.ambiguityReason !== undefined, 'Ambiguity reason provided to user');

console.log('\n--- 2. Testing Conflict & Duplicate Detector ---');

// Conflict Test: Lab relocation between Notice 4 original and Notice 4 conflict
const conflicts = detectConflicts(INITIAL_DEMO_NOTICES);
assert(conflicts.length >= 1, `Conflicts detected: ${conflicts.length}`);
const venueConflict = conflicts.find(c => c.conflictType === 'venue');
assert(venueConflict !== undefined, 'Venue conflict successfully flagged between Lab 204 and Advanced Systems Lab 305');
if (venueConflict) {
  console.log(`    Detail: ${venueConflict.description}`);
}

// Duplicate Test: Identical or near identical forwards
const duplicates = detectDuplicates([
  INITIAL_DEMO_NOTICES[0],
  {
    ...INITIAL_DEMO_NOTICES[0],
    id: 'dup-1',
    createdAt: new Date().toISOString()
  }
]);
assert(duplicates.length >= 1, `Duplicate forward detected with score ${duplicates[0]?.similarityScore}%`);

console.log('\n--- 3. Testing Weekly Pulse AI Digest ---');
const digest = generateWeeklyDigestLocally(INITIAL_DEMO_NOTICES);
assert(!!digest.weekRange.start && !!digest.weekRange.end, `Week range computed: ${digest.weekRange.start} - ${digest.weekRange.end}`);
assert(digest.summary.length > 20, 'Digest summary generated from actual student data');
assert(digest.actionChecklist.length > 0, `Action checklist items created: ${digest.actionChecklist.length}`);
assert(digest.overdueTasks.length >= 1, 'Overdue library book detected and flagged');

console.log('\n--- 4. Testing Deadline Countdown Engine ---');
const overdueCD = getDeadlineCountdown(new Date(Date.now() - 3600000 * 24).toISOString());
assert(overdueCD.isOverdue === true, 'Past deadline recognized as overdue');
assert(overdueCD.urgencyLevel === 'critical', 'Overdue marked critical');

const upcomingCD = getDeadlineCountdown(new Date(Date.now() + 3600000 * 12).toISOString());
assert(upcomingCD.isOverdue === false, 'Future deadline recognized');
assert(upcomingCD.urgencyLevel === 'critical', 'Deadline in 12h marked critical countdown');

console.log(`\n========================================`);
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
