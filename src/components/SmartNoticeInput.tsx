import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { CampusNotice, NoticeCategory, NoticePriority, InferredFlags } from '../types/index.ts';
import { parseNoticeLocally, parseNoticeWithAI, ParseResult } from '../services/parser.ts';
import { SAMPLE_INPUT_PRESETS, SampleNoticeTemplate } from '../data/sampleNotices.ts';
import { loadApiKeyFromStorage } from '../services/storage.ts';

interface SmartNoticeInputProps {
  onSaveNotice: (notice: CampusNotice) => void;
  onCancel?: () => void;
  initialNoticeToEdit?: CampusNotice | null;
}

export const SmartNoticeInput: React.FC<SmartNoticeInputProps> = ({
  onSaveNotice,
  onCancel,
  initialNoticeToEdit
}) => {
  const [inputText, setInputText] = useState(initialNoticeToEdit ? initialNoticeToEdit.rawText : '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ParseResult | null>(
    initialNoticeToEdit ? {
      title: initialNoticeToEdit.title,
      summary: initialNoticeToEdit.summary,
      category: initialNoticeToEdit.category,
      priority: initialNoticeToEdit.priority,
      eventDate: initialNoticeToEdit.eventDate,
      eventTime: initialNoticeToEdit.eventTime,
      deadline: initialNoticeToEdit.deadline,
      venue: initialNoticeToEdit.venue,
      audience: initialNoticeToEdit.audience,
      suggestedAction: initialNoticeToEdit.suggestedAction,
      confidenceScore: initialNoticeToEdit.confidenceScore,
      inferredFields: initialNoticeToEdit.inferredFields,
      parsingMode: initialNoticeToEdit.parsingMode,
      hasAmbiguousDate: !!initialNoticeToEdit.hasAmbiguousDate,
      ambiguityReason: initialNoticeToEdit.ambiguityReason
    } : null
  );

  const [dateConfirmed, setDateConfirmed] = useState(initialNoticeToEdit ? !!initialNoticeToEdit.dateConfirmed : false);

  const apiKey = loadApiKeyFromStorage();

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setParseError('Please paste or type an announcement text to analyze.');
      return;
    }

    setParseError(null);
    setIsAnalyzing(true);

    try {
      if (apiKey && apiKey.trim().length > 5) {
        try {
          const aiResult = await parseNoticeWithAI(inputText, apiKey);
          setExtractedData(aiResult);
          setDateConfirmed(!aiResult.hasAmbiguousDate);
        } catch (aiErr) {
          console.warn('AI Parsing failed, falling back to rule-based parser:', aiErr);
          const localResult = parseNoticeLocally(inputText);
          setExtractedData(localResult);
          setDateConfirmed(!localResult.hasAmbiguousDate);
        }
      } else {
        // Deterministic local parser
        const localResult = parseNoticeLocally(inputText);
        setExtractedData(localResult);
        setDateConfirmed(!localResult.hasAmbiguousDate);
      }
    } catch (err: any) {
      setParseError(err.message || 'Failed to analyze announcement.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyPreset = (preset: SampleNoticeTemplate) => {
    setInputText(preset.text);
    setParseError(null);
    setExtractedData(null);
  };

  const handleFieldChange = (field: keyof ParseResult, value: any) => {
    if (!extractedData) return;
    setExtractedData({
      ...extractedData,
      [field]: value
    });
  };

  const handleSave = () => {
    if (!extractedData) return;

    if (!extractedData.title.trim()) {
      setParseError('Title cannot be empty.');
      return;
    }

    const newNotice: CampusNotice = {
      id: initialNoticeToEdit ? initialNoticeToEdit.id : `notice-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      rawText: inputText,
      title: extractedData.title,
      summary: extractedData.summary,
      category: extractedData.category,
      priority: extractedData.priority,
      status: extractedData.priority === 'urgent' ? 'urgent' : (extractedData.hasAmbiguousDate && !dateConfirmed ? 'needs_clarification' : 'upcoming'),
      eventDate: extractedData.eventDate || null,
      eventTime: extractedData.eventTime || null,
      deadline: extractedData.deadline || null,
      venue: extractedData.venue === 'Not specified' ? null : extractedData.venue,
      audience: extractedData.audience === 'All campus students' ? null : extractedData.audience,
      suggestedAction: extractedData.suggestedAction || null,
      isCompleted: initialNoticeToEdit ? initialNoticeToEdit.isCompleted : false,
      isDismissed: false,
      createdAt: initialNoticeToEdit ? initialNoticeToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parsingMode: extractedData.parsingMode,
      confidenceScore: extractedData.confidenceScore,
      inferredFields: extractedData.inferredFields,
      hasAmbiguousDate: extractedData.hasAmbiguousDate,
      ambiguityReason: extractedData.ambiguityReason,
      dateConfirmed
    };

    onSaveNotice(newNotice);
  };

  return (
    <div className="bg-[#160E22] border border-[#8B2EFF]/30 rounded-3xl shadow-2xl p-5 sm:p-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#8B2EFF]/20">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-[#8B2EFF] to-[#FF38B8] text-white">
              <Sparkles className="w-5 h-5" />
            </span>
            {initialNoticeToEdit ? 'Edit Campus Notice' : 'Smart Notice Ingestion'}
          </h2>
          <p className="text-xs text-[#B9ADC9] mt-0.5">
            Paste forwarded WhatsApp messages, college circulars, or email texts to extract dates, venues, deadlines & actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {apiKey ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#22D3A6]/10 text-[#22D3A6] border border-[#22D3A6]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              AI Mode Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#8B2EFF]/15 text-[#B44CFF] border border-[#8B2EFF]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B44CFF]"></span>
              Rule-based parsing
            </span>
          )}
        </div>
      </div>

      {/* Realistic sample notice buttons */}
      {!initialNoticeToEdit && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B9ADC9]">
              Try sample college announcements:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_INPUT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-xs px-2.5 py-1 rounded-xl bg-[#100C14] hover:bg-[#251538] border border-[#8B2EFF]/25 hover:border-[#FF38B8]/50 text-[#B9ADC9] hover:text-white transition-all flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A24]"></span>
                <span>{preset.name}</span>
                <span className="text-[10px] text-[#B9ADC9]/60 font-mono">({preset.tag})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Text Area */}
      <div className="relative mb-4">
        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (parseError) setParseError(null);
          }}
          placeholder="Paste raw announcement text here... (e.g. 'Guys note down: DSA Assignment 3 due Friday 11:59 PM on Moodle. Penalty for late submissions. - Prof. Sharma')"
          className="w-full bg-[#100C14] border border-[#8B2EFF]/25 focus:border-[#FF38B8] focus:ring-1 focus:ring-[#FF38B8] rounded-2xl p-3.5 text-sm text-[#F8F5FF] placeholder-[#B9ADC9]/50 outline-none transition-colors font-sans leading-relaxed"
        />
        {inputText && (
          <button
            type="button"
            onClick={() => {
              setInputText('');
              setExtractedData(null);
            }}
            className="absolute top-3 right-3 text-[#B9ADC9] hover:text-white p-1 rounded-lg bg-[#251538]"
            title="Clear text"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {parseError && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{parseError}</span>
        </div>
      )}

      {/* Action button to analyze */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="text-xs text-[#B9ADC9] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#22D3A6]" />
          <span>Zero hallucination: Missing details are flagged as &ldquo;Not specified&rdquo;</span>
        </div>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#B9ADC9] hover:text-white hover:bg-[#251538] transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B2EFF] via-[#FF38B8] to-[#FF8A24] hover:opacity-95 text-white shadow-lg shadow-[#8B2EFF]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Analyzing Notice...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{extractedData ? 'Re-Analyze Notice' : 'Analyze Notice'}</span>
              </>
            )}
          </button>
        </div>
      </div>
            title="Clear text"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {parseError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{parseError}</span>
        </div>
      )}

      {/* Action button to analyze */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero hallucination: Missing details are flagged as &ldquo;Not specified&rdquo;</span>
        </div>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Analyzing Notice...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{extractedData ? 'Re-Analyze Notice' : 'Analyze Notice'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editable Preview Card (When Extracted) */}
      {extractedData && (
        <div className="mt-6 pt-5 border-t border-[#8B2EFF]/25 bg-[#120B1A]/80 rounded-2xl p-4 sm:p-5 border border-[#8B2EFF]/30">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#22D3A6]" />
                Extracted Intelligence Preview
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#100C14] text-[#B9ADC9] border border-[#8B2EFF]/25">
                Confidence: {extractedData.confidenceScore}%
              </span>
            </div>
            <div className="text-[11px] text-[#B9ADC9]">
              Verify and adjust any field before saving:
            </div>
          </div>

          {/* Ambiguity Warning Banner if applicable */}
          {extractedData.hasAmbiguousDate && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <p className="font-semibold">Ambiguous Date Pattern Detected</p>
                  <p className="text-amber-200/80 mt-0.5">{extractedData.ambiguityReason}</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer flex-shrink-0 bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-500/40">
                <input
                  type="checkbox"
                  checked={dateConfirmed}
                  onChange={(e) => setDateConfirmed(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <span className="text-[11px] font-medium text-amber-100">Confirm Date</span>
              </label>
            </div>
          )}

          {/* Form Fields for Review */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#B9ADC9] mb-1 flex items-center justify-between">
                <span>Title</span>
                {extractedData.inferredFields.title && (
                  <span className="text-[10px] text-[#B44CFF] font-mono">(Inferred)</span>
                )}
              </label>
              <input
                type="text"
                value={extractedData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full bg-[#100C14] border border-[#8B2EFF]/30 focus:border-[#FF38B8] rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-[#B9ADC9] mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-[#B9ADC9]" /> Category</span>
                {extractedData.inferredFields.category && (
                  <span className="text-[10px] text-[#B44CFF] font-mono">(Inferred)</span>
                )}
              </label>
              <select
                value={extractedData.category}
                onChange={(e) => handleFieldChange('category', e.target.value as NoticeCategory)}
                className="w-full bg-[#100C14] border border-[#8B2EFF]/30 focus:border-[#FF38B8] rounded-xl px-3 py-2 text-sm text-white capitalize"
              >
                <option value="assignment">Assignment</option>
                <option value="exam">Examination</option>
                <option value="event">Campus Event</option>
                <option value="deadline">Deadline Alert</option>
                <option value="placement">Placement / Careers</option>
                <option value="holiday">Holiday / Recess</option>
                <option value="administrative">Administrative</option>
                <option value="general">General Notice</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-[#B9ADC9] mb-1 flex items-center justify-between">
                <span>Priority Level</span>
                {extractedData.inferredFields.priority && (
                  <span className="text-[10px] text-[#B44CFF] font-mono">(Inferred)</span>
                )}
              </label>
              <select
                value={extractedData.priority}
                onChange={(e) => handleFieldChange('priority', e.target.value as NoticePriority)}
                className="w-full bg-[#100C14] border border-[#8B2EFF]/30 focus:border-[#FF38B8] rounded-xl px-3 py-2 text-sm text-white capitalize"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Event Date vs Deadline */}
            <div>
              <label className="block text-xs font-semibold text-[#B9ADC9] mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#FF8A24]" /> Event Date (When it takes place)</span>
                {extractedData.eventDate ? (
                  <span className="text-[10px] text-[#22D3A6]">Specified</span>
                ) : (
                  <span className="text-[10px] text-[#B9ADC9]/60">Not specified</span>
                )}
              </label>
              <input
                type="datetime-local"
                value={extractedData.eventDate ? extractedData.eventDate.substring(0, 16) : ''}
                onChange={(e) => handleFieldChange('eventDate', e.target.value ? `${e.target.value}:00` : null)}
                className="w-full bg-[#100C14] border border-[#8B2EFF]/30 focus:border-[#FF38B8] rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#B9ADC9] mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#FF38B8]" /> Submission Deadline (Due by)</span>
                {extractedData.deadline ? (
                  <span className="text-[10px] text-[#FF38B8]">Specified</span>
                ) : (
                  <span className="text-[10px] text-[#B9ADC9]/60">Not specified</span>
                )}
              </label>
              <input
                type="datetime-local"
                value={extractedData.deadline ? extractedData.deadline.substring(0, 16) : ''}
                onChange={(e) => handleFieldChange('deadline', e.target.value ? `${e.target.value}:00` : null)}
                className="w-full bg-[#100C14] border border-[#8B2EFF]/30 focus:border-[#FF38B8] rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            {/* Venue & Time */}
            <div>
              <label className="block text-xs font-semibold text-[#B9ADC9] mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#22D3A6]" /> Venue / Location</span>
                {extractedData.venue !== 'Not specified' ? (
                  <span className="text-[10px] text-[#22D3A6]">Specified</span>
                ) : (
                  <span className="text-[10px] text-[#B9ADC9]/60">Not specified</span>
                )}
              </label>
              <input
                type="text"
                value={extractedData.venue || 'Not specified'}
                onChange={(e) => handleFieldChange('venue', e.target.value)}
                className="w-full bg-[#100C14] border border-[#8B2EFF]/30 focus:border-[#FF38B8] rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#B9ADC9] mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#B44CFF]" /> Target Audience</span>
              </label>
              <input
                type="text"
                value={extractedData.audience || 'All campus students'}
                onChange={(e) => handleFieldChange('audience', e.target.value)}
                className="w-full bg-[#100C14] border border-[#8B2EFF]/30 focus:border-[#FF38B8] rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            {/* Summary */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#B9ADC9] mb-1">
                Concise Summary
              </label>
              <textarea
                rows={2}
                value={extractedData.summary}
                onChange={(e) => handleFieldChange('summary', e.target.value)}
                className="w-full bg-[#100C14] border border-[#8B2EFF]/30 focus:border-[#FF38B8] rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            {/* Suggested Next Action */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#FFC857] mb-1 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#FFC857]" />
                Suggested Next Action for Student
              </label>
              <input
                type="text"
                value={extractedData.suggestedAction || ''}
                onChange={(e) => handleFieldChange('suggestedAction', e.target.value)}
                className="w-full bg-[#100C14] border border-[#FF8A24]/40 focus:border-[#FF8A24] rounded-xl px-3 py-2 text-sm text-[#FFC857]"
                placeholder="e.g. Upload PDF to Moodle before 11:59 PM"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-5 pt-4 border-t border-[#8B2EFF]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setExtractedData(null)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#B9ADC9] hover:text-white"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#22D3A6] to-[#10B981] hover:opacity-95 text-[#100C14] shadow-lg shadow-[#22D3A6]/25 transition-all transform active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{initialNoticeToEdit ? 'Save Updates' : 'Confirm & Save Notice'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

