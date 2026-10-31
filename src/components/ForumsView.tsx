import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, MessageCircle, Share2, Plus, Tag, Search, Sparkles } from 'lucide-react';
import { ForumPost } from '../types/index.ts';
import { INITIAL_FORUM_POSTS } from '../data/campusData.ts';

export const ForumsView: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<ForumPost['category']>('academics');

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: newTitle,
      author: 'Ashu',
      authorRole: '3rd Year CSE • Scholar',
      avatarColor: 'from-[#8B2EFF] to-[#FF38B8]',
      content: newContent,
      category: newCategory,
      likes: 1,
      isLiked: true,
      repliesCount: 0,
      createdAt: 'Just now',
      tags: ['Discussion', 'MITCampus']
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowNewPostModal(false);
  };

  const filteredPosts = posts.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#FF8A24] to-[#FFC857] text-white">
              <MessageSquare className="w-5 h-5 text-[#100C14]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Campus Forums & Discussions
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#B9ADC9] mt-1">
            Connect with peers, collaborate on hackathons, and exchange academic notes at MIT Campus.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B2EFF] to-[#FF38B8] hover:from-[#9D4DFF] hover:to-[#FF4FBF] text-white font-bold text-xs shadow-lg shadow-[#8B2EFF]/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Filter Category Pills & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1C102A]/80 border border-[#8B2EFF]/25 p-3 rounded-2xl backdrop-blur-md">
        
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'academics', 'events', 'campus-life', 'placements'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#8B2EFF] to-[#FF38B8] text-white shadow-md'
                  : 'text-[#B9ADC9] hover:text-white hover:bg-[#251538]'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#B9ADC9] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions..."
            className="w-full bg-[#100C14] border border-[#8B2EFF]/20 focus:border-[#FF38B8] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#B9ADC9]/60 outline-none"
          />
        </div>

      </div>

      {/* Forum Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="p-5 rounded-3xl bg-gradient-to-b from-[#1C102A]/90 to-[#100C14]/95 border border-[#8B2EFF]/25 hover:border-[#FF38B8]/50 transition-all duration-300 shadow-xl space-y-3"
          >
            {/* Author row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${post.avatarColor} p-0.5 shadow-md`}>
                  <div className="w-full h-full bg-[#100C14] rounded-full flex items-center justify-center font-bold text-xs text-white">
                    {post.author[0]}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{post.author}</h4>
                  <p className="text-[11px] text-[#B9ADC9]">{post.authorRole}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-[#B9ADC9]/70">{post.createdAt}</span>
            </div>

            {/* Post Title & Content */}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white hover:text-[#FFC857] transition-colors">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#B9ADC9] mt-2 leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Tags & Actions */}
            <div className="pt-3 border-t border-[#8B2EFF]/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#100C14] text-[#B9ADC9] border border-[#8B2EFF]/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all ${
                    post.isLiked
                      ? 'bg-[#FF38B8]/20 text-[#FF38B8] font-bold border border-[#FF38B8]/40'
                      : 'text-[#B9ADC9] hover:text-white hover:bg-[#251538]'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.likes}</span>
                </button>

                <div className="flex items-center gap-1.5 text-[#B9ADC9] px-2 py-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{post.repliesCount} replies</span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#160E22] border border-[#8B2EFF]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Campus Discussion</h3>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#B9ADC9] mb-1">Topic Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Hackathon Team Formation or DSA Exam Query"
                  className="w-full bg-[#100C14] border border-[#8B2EFF]/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FF38B8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9ADC9] mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ForumPost['category'])}
                  className="w-full bg-[#100C14] border border-[#8B2EFF]/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FF38B8]"
                >
                  <option value="academics">Academics</option>
                  <option value="events">Events & Hackathons</option>
                  <option value="campus-life">Campus Life</option>
                  <option value="placements">Placements</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9ADC9] mb-1">Content</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share details, questions, or resources..."
                  className="w-full bg-[#100C14] border border-[#8B2EFF]/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FF38B8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#B9ADC9] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B2EFF] to-[#FF38B8] text-white shadow-lg"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

