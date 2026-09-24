import React from 'react';

export default function VideoPlayer({ videoId, title }) {
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-900 group">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl"></div>
    </div>
  );
}
