"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as Player from "@livepeer/react/player";
import { PauseIcon, PlayIcon } from "@livepeer/react/assets";
import { getSrc } from "@livepeer/react/external";
import { supabase } from "@/lib/supabaseClient";

export default function LivePage() {
  const [streams, setStreams] = useState([]);
  const [newPlaybackId, setNewPlaybackId] = useState("");
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });

  function isYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url);
  }

  function getYouTubeEmbedUrl(url) {
    try {
      const u = new URL(url);
      let videoId = "";
      if (u.hostname.includes("youtu.be")) {
        videoId = u.pathname.replace("/", "");
      } else if (u.hostname.includes("youtube.com")) {
        if (u.pathname.startsWith("/watch") || u.pathname.startsWith("/live")) {
          videoId = u.searchParams.get("v") || "";
        } else if (u.pathname.startsWith("/embed/")) {
          videoId = u.pathname.split("/embed/")[1];
        }
      }
      if (!videoId) return null;
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0`;
    } catch {
      return null;
    }
  }

  async function addStream() {
    const id = newPlaybackId.trim();
    if (!id) return;
    const exists = streams.some((s) => s.playbackId === id);
    if (exists) return;
    try {
      // Accept YouTube URLs without Livepeer validation
      const isYouTube = isYouTubeUrl(id);
      if (!isYouTube) {
        const res = await fetch(`/api/livepeer/validate?id=${encodeURIComponent(id)}`, { cache: "no-store" });
        const json = await res.json();
        if (!json?.ok) {
          setErrorModal({ open: true, message: "Stream is not reachable. Please check the Playback ID or URL." });
          return;
        }
      }
      setStreams((prev) => [{ playbackId: id }, ...prev]);
      try {
        const source = isYouTube ? 'youtube' : (/^https?:\/\//i.test(id) ? 'hls' : 'livepeer');
        const { error } = await supabase.from('streams').insert({ playback_id: id, source });
        if (error) console.error('Supabase insert error:', error.message);
      } catch {}
      setNewPlaybackId("");
    } catch {
      setErrorModal({ open: true, message: "Validation failed. Try again." });
    }
  }

  function removeStream(id) {
    setStreams((prev) => prev.filter((s) => s.playbackId !== id));
  }

  function getSrcFor(id) {
    const trimmed = id.trim();
    const isUrl = /^https?:\/\//i.test(trimmed);
    // HLS/PlaybackId only (YouTube handled in render)
    const src = isUrl ? trimmed : `https://livepeercdn.com/hls/${trimmed}/index.m3u8`;
    return [
      { src, type: "application/x-mpegURL" },
    ];
  }

  const demoInfoMap = {
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8": {
      title: "MUX Demo (x36xhzz)",
      source: "mux.dev",
    },
    "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8": {
      title: "Sintel Trailer (Akamai)",
      source: "akamaihd.net",
    },
    "f5eese9wwl88k4g8": {
      title: "Livepeer Docs Example",
      source: "livepeercdn.com",
    },
  };

  function getDemoInfo(id) {
    return demoInfoMap[id];
  }

  function getDisplayLabel(id) {
    try {
      if (/^https?:\/\//i.test(id)) {
        const u = new URL(id);
        const path = u.pathname.length > 20 ? u.pathname.slice(0, 20) + "…" : u.pathname;
        return `${u.hostname}${path}`;
      }
      if (id.length > 16) {
        return `${id.slice(0, 8)}…${id.slice(-6)}`;
      }
      return id;
    } catch {
      return id;
    }
  }

  // Load from Supabase (public). Fallback to demo if empty.
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('streams')
          .select('playback_id')
          .order('created_at', { ascending: false })
          .limit(60);
        if (!error && Array.isArray(data) && data.length > 0) {
          setStreams(data.map(d => ({ playbackId: d.playback_id })));
          return;
        }
      } catch {}
      setStreams([{ playbackId: "f5eese9wwl88k4g8" }]);
    })();
  }, []);

  // metrics polling state
  const [metrics, setMetrics] = useState({}); // { [playbackId]: { viewers, bitrate, resolution, latency } }
  const [ytMeta, setYtMeta] = useState({}); // { [url]: { title, author_name } }
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    let timer;
    async function fetchAll() {
      await Promise.all(
        streams.map(async ({ playbackId }) => {
          try {
            // only query metrics if it's a plain playbackId (not a full URL)
            if (/^https?:\/\//i.test(playbackId)) return;
            const res = await fetch(`/api/livepeer/metrics?playbackId=${encodeURIComponent(playbackId)}`, { cache: "no-store" });
            if (!res.ok) return;
            const json = await res.json();
            const d = json?.data || {};
            const summary = {
              viewers: d.viewers ?? d.currentViewers ?? "—",
              bitrate: d.bitrate ?? d.bitrateKbps ?? "—",
              resolution: d.resolution ?? "—",
              latency: d.latency ?? "—",
            };
            setMetrics((prev) => ({ ...prev, [playbackId]: summary }));
          } catch {}
        })
      );
    }
    fetchAll();
    timer = setInterval(fetchAll, 10000);
    return () => clearInterval(timer);
  }, [streams]);

  // YouTube metadata fetch
  useEffect(() => {
    async function fetchYt() {
      await Promise.all(
        streams.map(async ({ playbackId }) => {
          if (!/^https?:\/\//i.test(playbackId)) return;
          if (!/(youtube\.com|youtu\.be)\//i.test(playbackId)) return;
          try {
            const url = playbackId.startsWith("http") ? playbackId : `https://${playbackId}`;
            const res = await fetch(`/api/youtube/oembed?url=${encodeURIComponent(url)}`, { cache: "no-store" });
            if (!res.ok) return;
            const json = await res.json();
            setYtMeta((prev) => ({ ...prev, [playbackId]: json }));
          } catch {}
        })
      );
    }
    fetchYt();
  }, [streams]);

  return (
    <>
    <div className="min-h-screen pt-36 md:pt-44 pb-16 px-4 md:px-10 lg:px-24 xl:px-36 bg-[#070005]">
      <div className="bg-[#070005]/90 border border-purple-500/20 rounded-2xl p-4 md:p-6 shadow-xl backdrop-blur mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-white">Live</h1>
          <button
            onClick={() => setGuideOpen(true)}
            className="px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 text-white/80 text-sm"
          >How to Stream</button>
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs uppercase tracking-wide text-white/60 mb-1">Add a stream (Playback ID, HLS URL, or YouTube URL)</label>
            <input
              value={newPlaybackId}
              onChange={(e) => setNewPlaybackId(e.target.value)}
              placeholder="e.g. f5eese9wwl88k4g8 or https://...m3u8 or https://youtu.be/..."
              className="w-full px-3 py-2 rounded-md bg-[#1a001a] border border-purple-500/30 text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
            />
          </div>
          <button
            onClick={addStream}
            className="px-5 py-2.5 rounded-md bg-gradient-to-r from-red-magic to-blue-magic text-white font-medium hover:opacity-90 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Grid of streams */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {streams.length === 0 && (
          <div className="col-span-full text-white/60 text-sm">No streams yet. Add one with a Playback ID.</div>
        )}

        {streams.map(({ playbackId }, idx) => (
          <div key={playbackId} className={`bg-[#0e0010]/70 border border-purple-500/20 rounded-2xl p-3 shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-2xl fade-in-up`} style={{ animationDelay: `${idx * 80}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2.5 w-2.5 mr-0.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <div className="text-white/80 text-xs md:text-sm truncate" title={playbackId}>
                  {/(youtube\.com|youtu\.be)\//i.test(playbackId) ? "YouTube Live" : "Livepeer Live"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(playbackId)}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 text-xs border border-white/10"
                >Copy</button>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden ring-1 ring-purple-500/30 bg-gradient-to-b from-black to-[#130013]">
              {(() => {
                if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(playbackId)) {
                  const embed = getYouTubeEmbedUrl(playbackId.startsWith("http") ? playbackId : `https://${playbackId}`);
                  if (embed) {
                    return (
                      <div className="w-full aspect-video">
                        <iframe
                          src={embed}
                          className="w-full h-full"
                          allow="autoplay; encrypted-media; picture-in-picture"
                          allowFullScreen
                          title="YouTube Live"
                        />
                      </div>
                    );
                  }
                }
                return (
                  <Player.Root src={getSrcFor(playbackId)}>
                    <Player.Container className="w-full aspect-video">
                      <Player.Video title="Live stream" />
                      <Player.Controls className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2">
                        <Player.PlayPauseTrigger className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur border border-white/10">
                          <Player.PlayingIndicator asChild matcher={false}>
                            <PlayIcon />
                          </Player.PlayingIndicator>
                          <Player.PlayingIndicator asChild>
                            <PauseIcon />
                          </Player.PlayingIndicator>
                        </Player.PlayPauseTrigger>
                      </Player.Controls>
                    </Player.Container>
                  </Player.Root>
                );
              })()}
            </div>

            <div className="mt-3 flex items-center justify-between text-white/70 text-xs">
              <a
                href={/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(playbackId)
                  ? (playbackId.startsWith("http") ? playbackId : `https://${playbackId}`)
                  : `https://livepeercdn.com/hls/${playbackId}/index.m3u8`}
                target="_blank"
                rel="noreferrer"
                className="underline hover:no-underline text-white/80 hover:text-white"
              >Open HLS</a>
              <div className="text-white/50">
                {(() => {
                  const m = metrics[playbackId];
                  const viewers = m?.viewers ?? "—";
                  const bitrate = m?.bitrate ? `${m.bitrate} kbps` : "—";
                  return `Viewers ${viewers} • Bitrate ${bitrate}`;
                })()}
              </div>
            </div>
            {(() => {
              const meta = getDemoInfo(playbackId);
              const yt = ytMeta[playbackId];
              if (!meta && !yt) return null;
              return (
                <div className="mt-2 text-white/45 text-[11px] leading-snug">
                  {meta && (
                    <>
                      <div>Demo: {meta.title}</div>
                      <div>Source: {meta.source}</div>
                    </>
                  )}
                  {yt && (
                    <>
                      <div>Title: {yt.title}</div>
                      <div>Channel: {yt.author_name}</div>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
    {errorModal.open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70" onClick={() => setErrorModal({ open: false, message: "" })} />
        <div className="relative bg-[#0e0010] border border-red-500/30 rounded-2xl p-5 w-[90%] max-w-md shadow-2xl">
          <h3 className="text-white text-lg font-semibold mb-2">Stream Error</h3>
          <p className="text-white/80 text-sm mb-4">{errorModal.message}</p>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/15"
              onClick={() => setErrorModal({ open: false, message: "" })}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    {guideOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70" onClick={() => setGuideOpen(false)} />
        <div className="relative w-[96%] max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30">
          <div className="bg-gradient-to-r from-red-magic/70 to-blue-magic/70 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-xl md:text-2xl font-display font-semibold">How to Stream</h3>
              <button
                className="px-3 py-1.5 rounded-md bg-white/15 hover:bg-white/25 text-white/90 text-sm"
                onClick={() => setGuideOpen(false)}
              >Close</button>
            </div>
          </div>
          <div className="bg-[#0e0010] text-white/90 p-6 md:p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-xl border border-purple-500/20 bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                  <h4 className="text-white font-medium">Option 1 — Livepeer</h4>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-white/80 text-sm">
                  <li>Create an API key and a stream in Livepeer Studio. <a href="https://docs.livepeer.org/developers/quick-start" className="underline" target="_blank" rel="noreferrer">Docs</a></li>
                  <li>Configure OBS with Ingest URL + Stream Key and start streaming.</li>
                  <li>Copy the Playback ID from the stream.</li>
                  <li>Paste the Playback ID into the input above and click <span className="text-white">Add</span>.</li>
                </ol>
              </div>
              <div className="rounded-xl border border-purple-500/20 bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-400"></span>
                  <h4 className="text-white font-medium">Option 2 — YouTube Live</h4>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-white/80 text-sm">
                  <li>Go live from YouTube Studio.</li>
                  <li>Copy the live URL (watch/share, e.g. https://youtu.be/...).</li>
                  <li>Paste the URL into the input above and click <span className="text-white">Add</span>.</li>
                </ol>
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-purple-500/20 bg-white/5 p-4 text-xs text-white/70">
              Tip: You can add multiple streams. Livepeer cards show metrics; YouTube cards show title and channel.
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}


