import React, { useMemo, useState } from 'react';

export default function AIVideoGallery() {
  const envMp4 = import.meta.env.VITE_AI_VIDEO_URLS || '';
  const envYouTube = import.meta.env.VITE_AI_YOUTUBE_IDS || '';

  const mp4Videos = useMemo(() => {
    const urls = envMp4
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return urls.map((src, i) => ({
      id: `mp4-${i}`,
      type: 'mp4',
      src,
      title: 'AI Generated Visual',
      description: 'Relaxing, calming AI visuals for mindfulness.',
    }));
  }, [envMp4]);

  const youtubeVideos = useMemo(() => {
    const ids = envYouTube
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return ids.map((id, i) => ({
      id: `yt-${i}`,
      type: 'youtube',
      src: `https://www.youtube.com/embed/${id}`,
      title: 'AI Generated Visual',
      description: 'Guided visuals to help you unwind.',
    }));
  }, [envYouTube]);

  // Fallback samples (replace with your own AI-generated content later)
  const fallback = [
    {
      id: 'yt-fallback-1',
      type: 'youtube',
      src: 'https://www.youtube.com/embed/2Lz0VOltZKA', // Example: abstract generative visuals
      title: 'Calming Generative Art',
      description: 'Soft motion graphics for relaxation.',
    },
    {
      id: 'yt-fallback-2',
      type: 'youtube',
      src: 'https://www.youtube.com/embed/f1x9lgX8GaE', // Example: ambient AI visuals
      title: 'Ambient AI Motion',
      description: 'Gentle ambient scenes for focus.',
    },
    {
      id: 'yt-fallback-3',
      type: 'youtube',
      src: 'https://www.youtube.com/embed/mb2rQbpvVZU', // Example: soothing loops
      title: 'Soothing Loops',
      description: 'Minimal loops to reduce stress.',
    },
  ];

  const videos = (mp4Videos.length || youtubeVideos.length)
    ? [...mp4Videos, ...youtubeVideos]
    : fallback;

  const [playing, setPlaying] = useState({});

  const togglePlay = (id) => {
    setPlaying((prev) => ({ ...prev, [id]: !prev[id] }));
    const el = document.getElementById(id);
    if (!el) return;
    if (prevPlaying(id)) el.pause(); else el.play();
  };

  const prevPlaying = (id) => !!playing[id];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text-dark, #2d2d2d)' }}>
            Guided AI Visuals
          </h2>
          <p className="text-gray-600 mt-2">Short, calming videos generated to support mindfulness.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <div key={v.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
              {v.type === 'mp4' ? (
                <div className="relative">
                  <video
                    id={v.id}
                    src={v.src}
                    className="w-full h-56 object-cover"
                    muted
                    loop
                    playsInline
                    controls
                  />
                </div>
              ) : (
                <div className="relative">
                  <iframe
                    className="w-full h-56"
                    src={v.src}
                    title={v.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          Tip: Set your own AI videos via env: <span className="font-mono">VITE_AI_VIDEO_URLS</span> (mp4, comma-separated) or <span className="font-mono">VITE_AI_YOUTUBE_IDS</span> (YouTube IDs).
        </div>
      </div>
    </section>
  );
}
