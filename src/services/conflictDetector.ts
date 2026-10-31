import type { CampusNotice, ConflictAlert, DuplicateCandidate } from '../types/index.ts';

function tokenize(text: string): Set<string> {
  const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = clean.split(/\s+/).filter(w => w.length > 2 && !isStopWord(w));
  return new Set(words);
}

function isStopWord(w: string): boolean {
  const stops = new Set(['the', 'and', 'for', 'with', 'from', 'this', 'that', 'will', 'have', 'been', 'all', 'batch', 'year', 'dept', 'held', 'notice']);
  return stops.has(w);
}

function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function detectDuplicates(notices: CampusNotice[]): DuplicateCandidate[] {
  const duplicates: DuplicateCandidate[] = [];

  for (let i = 0; i < notices.length; i++) {
    for (let j = i + 1; j < notices.length; j++) {
      const a = notices[i];
      const b = notices[j];

      // Compare titles and raw text tokens
      const titleTokensA = tokenize(a.title);
      const titleTokensB = tokenize(b.title);
      const titleSim = calculateJaccardSimilarity(titleTokensA, titleTokensB);

      const textTokensA = tokenize(a.rawText);
      const textTokensB = tokenize(b.rawText);
      const textSim = calculateJaccardSimilarity(textTokensA, textTokensB);

      const overallSim = (titleSim * 0.6) + (textSim * 0.4);

      if (overallSim >= 0.70) {
        duplicates.push({
          noticeA: a,
          noticeB: b,
          similarityScore: Math.round(overallSim * 100),
          reason: `High textual similarity (${Math.round(overallSim * 100)}%) between "${a.title}" and "${b.title}"`
        });
      }
    }
  }

  return duplicates;
}

export function detectConflicts(notices: CampusNotice[]): ConflictAlert[] {
  const conflicts: ConflictAlert[] = [];

  for (let i = 0; i < notices.length; i++) {
    for (let j = i + 1; j < notices.length; j++) {
      const a = notices[i];
      const b = notices[j];

      // Must be two distinct notices
      if (a.id === b.id) continue;

      // Sort chronologically
      const [orig, newer] = new Date(a.createdAt).getTime() <= new Date(b.createdAt).getTime() ? [a, b] : [b, a];

      // Compare both title tokens and content tokens
      const titleTokensA = tokenize(orig.title);
      const titleTokensB = tokenize(newer.title);
      const commonTitleWords = Array.from(titleTokensA).filter(w => titleTokensB.has(w));

      const textTokensA = tokenize(orig.rawText);
      const textTokensB = tokenize(newer.rawText);
      const commonTextWords = Array.from(textTokensA).filter(w => textTokensB.has(w));

      // Significant campus subject keywords
      const coreKeywords = ['networks', 'dsa', 'operating', 'exam', 'examination', 'chemistry', 'physics', 'hackathon', 'library', 'lab'];
      const sharesCoreKeyword = coreKeywords.some(kw => 
        (titleTokensA.has(kw) || textTokensA.has(kw)) && 
        (titleTokensB.has(kw) || textTokensB.has(kw))
      );

      const hasTopicOverlap = commonTitleWords.length >= 1 || commonTextWords.length >= 3 || sharesCoreKeyword;

      if (!hasTopicOverlap) continue;

      // 1. Venue Conflict
      const origVenueNorm = orig.venue?.toLowerCase().trim();
      const newVenueNorm = newer.venue?.toLowerCase().trim();
      const hasVenueConflict = 
        origVenueNorm && 
        newVenueNorm && 
        origVenueNorm !== 'not specified' && 
        newVenueNorm !== 'not specified' && 
        origVenueNorm !== newVenueNorm;

      // 2. Date/Time Conflict
      const origDateNorm = orig.eventDate ? orig.eventDate.split('T')[0] : null;
      const newDateNorm = newer.eventDate ? newer.eventDate.split('T')[0] : null;
      const hasDateConflict = origDateNorm && newDateNorm && origDateNorm !== newDateNorm;

      // 3. Deadline Conflict
      const origDeadline = orig.deadline ? orig.deadline.split('T')[0] : null;
      const newDeadline = newer.deadline ? newer.deadline.split('T')[0] : null;
      const hasDeadlineConflict = origDeadline && newDeadline && origDeadline !== newDeadline;

      if (hasVenueConflict && (origDateNorm === newDateNorm || hasDateConflict || (!origDateNorm && !newDateNorm))) {
        conflicts.push({
          originalNotice: orig,
          conflictingNotice: newer,
          conflictType: 'venue',
          description: `Venue mismatch for "${orig.title}": Original was "${orig.venue}", but newer notice mentions "${newer.venue}".`,
          detectedAt: new Date().toISOString()
        });
      } else if (hasDateConflict) {
        conflicts.push({
          originalNotice: orig,
          conflictingNotice: newer,
          conflictType: 'date',
          description: `Schedule change for "${orig.title}": Original date was ${origDateNorm}, newer announcement states ${newDateNorm}.`,
          detectedAt: new Date().toISOString()
        });
      } else if (hasDeadlineConflict) {
        conflicts.push({
          originalNotice: orig,
          conflictingNotice: newer,
          conflictType: 'deadline',
          description: `Deadline change for "${orig.title}": Original deadline was ${origDeadline}, newer announcement specifies ${newDeadline}.`,
          detectedAt: new Date().toISOString()
        });
      }
    }
  }

  return conflicts;
}
