import React, { useState } from 'react';
import { 
  X, 
  Key, 
  RotateCcw, 
  Trash2, 
  Download, 
  Upload, 
  ShieldCheck, 
  Info, 
  AlertTriangle,
  Check,
  Globe,
  Database
} from 'lucide-react';
import { 
  loadApiKeyFromStorage, 
  saveApiKeyToStorage, 
  exportNoticesAsJSON 
} from '../services/storage.ts';
import { CampusNotice, Language } from '../types/index.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: CampusNotice[];
  onResetDemo: () => void;
  onClearAll: () => void;
  onImportNotices: (imported: CampusNotice[]) => void;
  lang: Language;
  onToggleLang: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  notices,
  onResetDemo,
  onClearAll,
  onImportNotices,
  lang,
  onToggleLang
}) => {
  const [apiKey, setApiKey] = useState(loadApiKeyFromStorage());
  const [isSaved, setIsSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    saveApiKeyToStorage(apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportNotices(json);
          onClose();
        } else {
          alert('Invalid file format. Expected a JSON array of notices.');
        }
      } catch {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-[#160E22] border border-[#8B2EFF]/35 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#8B2EFF]/20 bg-[#100C14]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#8B2EFF]/20 text-[#B44CFF]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Application Settings</h2>
              <p className="text-xs text-[#B9ADC9]">Data persistence, AI engine, and preferences</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#B9ADC9] hover:text-white bg-[#1B1024] hover:bg-[#251538] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Privacy & Storage Guarantee Banner */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Browser Local Storage & Privacy</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              All notices, deadlines, and preferences are stored 100% locally in your browser&apos;s <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">localStorage</code>. Data stays strictly on your device and is not sent to external servers or synced across other machines.
            </p>
          </div>

          {/* Optional Gemini AI API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Key className="w-4 h-4 text-indigo-400" />
                <span>Gemini API Key (Optional Real AI Mode)</span>
              </label>
              {apiKey ? (
                <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
              ) : (
                <span className="text-[10px] text-slate-500">Using deterministic fallback</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              If left empty, Campus Pulse AI utilizes its built-in rule-based deterministic parsing engine. If provided, it calls Gemini 1.5 Flash securely from your browser.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 bg-[#0B0F19] border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none font-mono"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : 'Save Key'}
              </button>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Interface Language</span>
              </div>
              <p className="text-[11px] text-slate-400">Switch dashboard labels between English and Hindi</p>
            </div>
            <button
              onClick={onToggleLang}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0B0F19] border border-slate-700 hover:border-slate-600 text-white"
            >
              {lang === 'en' ? 'English (Current)' : 'हिंदी (सक्रिय)'}
            </button>
          </div>

          {/* Backup & Export / Import JSON */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Data Backup & Migration
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => exportNoticesAsJSON(notices)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Notices JSON</span>
              </button>

              <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset Demo Data & Clear All Section */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Demo Data & Reset
            </h4>

            <div className="flex flex-wrap items-center gap-3">
              {showResetConfirm ? (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-xs text-amber-300 font-medium">Reset to default demo data?</span>
                  <button
                    onClick={() => {
                      onResetDemo();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-black"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2 py-1 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Reset Demo Data</span>
                </button>
              )}

              {showClearConfirm ? (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <span className="text-xs text-rose-300 font-medium">Permanently erase all notices?</span>
                  <button
                    onClick={() => {
                      onClearAll();
                      setShowClearConfirm(false);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white"
                  >
                    Yes, Erase All
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-1 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Notices</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0B0F19] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Close Settings
          </button>
        </div>

      </div>
    </div>
  );
};

