import React, { useState } from 'react';
import { FolderDown, Search, Download, FileText, CheckCircle2, BookOpen, Filter } from 'lucide-react';
import { CampusResource } from '../types/index.ts';
import { INITIAL_CAMPUS_RESOURCES } from '../data/campusData.ts';

export const ResourcesView: React.FC = () => {
  const [resources] = useState<CampusResource[]>(INITIAL_CAMPUS_RESOURCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (res: CampusResource) => {
    setDownloadingId(res.id);
    setTimeout(() => {
      setDownloadingId(null);
      // Trigger a light dummy file download
      const element = document.createElement("a");
      const file = new Blob([`MIT Campus Academic Resource\nTitle: ${res.title}\nDepartment: ${res.department}\nSemester: ${res.semester}\nVerified by Campus Pulse AI.`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${res.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 800);
  };

  const filteredResources = resources.filter(r => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.department.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#B44CFF] to-[#EC4899] text-white">
              <FolderDown className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Academic Resources & Library
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#B9ADC9] mt-1">
            Curated lecture notes, previous year question papers (PYQs), and laboratory manuals for MIT Campus.
          </p>
        </div>

        <div className="text-xs font-mono text-[#B9ADC9] bg-[#1C102A] px-3 py-1.5 rounded-xl border border-[#8B2EFF]/30 self-start sm:self-auto">
          {resources.length} Verified Documents Available
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1C102A]/80 border border-[#8B2EFF]/25 p-3 rounded-2xl backdrop-blur-md">
        
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'manual', 'pyq', 'notes', 'handbook'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#B44CFF] to-[#FF38B8] text-white shadow-md'
                  : 'text-[#B9ADC9] hover:text-white hover:bg-[#251538]'
              }`}
            >
              {cat === 'all' ? 'All Files' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#B9ADC9] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, PYQs, manuals..."
            className="w-full bg-[#100C14] border border-[#8B2EFF]/20 focus:border-[#FF38B8] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#B9ADC9]/60 outline-none"
          />
        </div>

      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => {
          const isDownloading = downloadingId === res.id;

          return (
            <div
              key={res.id}
              className="p-5 rounded-3xl bg-gradient-to-b from-[#1C102A]/90 to-[#100C14]/95 border border-[#8B2EFF]/25 hover:border-[#FF38B8]/50 transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#8B2EFF]/20 text-[#B44CFF] uppercase border border-[#8B2EFF]/30">
                    {res.category}
                  </span>
                  <span className="text-[11px] font-mono text-[#B9ADC9]">
                    {res.fileSize} • {res.format}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#FFC857] transition-colors leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-[#B9ADC9] mt-2">
                  {res.department} • {res.semester}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#8B2EFF]/15 flex items-center justify-between">
                <span className="text-[11px] text-[#B9ADC9]/70 font-mono">
                  {res.downloads} downloads
                </span>

                <button
                  onClick={() => handleDownload(res)}
                  disabled={isDownloading}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#8B2EFF]/20 hover:bg-[#8B2EFF]/40 text-white border border-[#8B2EFF]/30 hover:border-[#FF38B8]/50 transition-all"
                >
                  {isDownloading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#FFC857]" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

