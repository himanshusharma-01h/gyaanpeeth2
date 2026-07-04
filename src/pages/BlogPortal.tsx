import React, { useState } from 'react';
import { Blog } from '../types';
import { Calendar, User, ArrowLeft, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';

interface BlogPortalProps {
  blogs: Blog[];
}

export default function BlogPortal({ blogs }: BlogPortalProps) {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Career Guide', 'College Review', 'News & Events'];

  const filteredBlogs = activeCategory === 'All'
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  return (
    <div id="blog-portal-container" className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 text-left">
      
      {!selectedBlog ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brand-700">News & Career Blog</h2>
              <p className="text-xs text-slate-500">Expert articles on online degree recognition, exam tips, and corporate career tracks</p>
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5 shrink-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  id={`blog-category-${cat}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeCategory === cat
                      ? 'bg-brand-700 text-white border-brand-700'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredBlogs.map(blog => (
              <div 
                key={blog.id} 
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between hover:border-slate-200 hover:shadow-lg transition-all"
              >
                <div>
                  <img src={blog.image} alt={blog.title} className="w-full h-44 object-cover" />
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-accent-600">
                      <span>{blog.category}</span>
                      <span>•</span>
                      <span>5 Min Read</span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-800 leading-snug line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <User className="w-3.5 h-3.5 text-slate-300" />
                    <span>{blog.author}</span>
                  </div>
                  <button
                    id={`blog-read-${blog.id}`}
                    onClick={() => setSelectedBlog(blog)}
                    className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <button
            id="back-to-blogs-btn"
            onClick={() => setSelectedBlog(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100/50 px-3 py-1.5 rounded-xl border border-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles list
          </button>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="bg-brand-50 border border-brand-100 text-brand-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide text-[10px]">
                {selectedBlog.category}
              </span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-300" />
                <span>Published: {selectedBlog.date}</span>
              </div>
            </div>

            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-slate-800 leading-tight">
              {selectedBlog.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80" alt={selectedBlog.author} className="w-6 h-6 rounded-full object-cover" />
              <span>Written by <span className="font-semibold text-slate-700">{selectedBlog.author}</span> • Senior Educational Counselor</span>
            </div>
          </div>

          <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-64 md:h-80 object-cover rounded-2xl" />

          <p className="text-xs text-slate-500 italic font-semibold border-l-4 border-accent-500 pl-4 py-1 leading-relaxed">
            "{selectedBlog.excerpt}"
          </p>

          <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line space-y-4 pt-2">
            {selectedBlog.content}
          </div>

          <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-xs">
            <span className="text-slate-400">Accredited by the UniPath Review Committee</span>
            <div className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4.5 h-4.5" /> Verified Guidelines
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
