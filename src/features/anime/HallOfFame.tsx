'use client';

import { useState, useEffect, useRef } from 'react';
import animeData from '@/data/anime.json';
import { FaStar, FaSpotify, FaYoutube, FaPlay, FaMusic, FaTimes } from 'react-icons/fa';
import { SiMyanimelist } from 'react-icons/si';

function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

export default function HallOfFame() {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [showTrailer, setShowTrailer] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isUserInteracted, setIsUserInteracted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const collection = animeData.favorites;

    // Auto-rotate banners every 5 seconds
    useEffect(() => {
        // Clear existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Don't auto-rotate if paused, showing trailer, or user just interacted
        if (isPaused || showTrailer || isUserInteracted) return;

        intervalRef.current = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % collection.length);
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPaused, showTrailer, isUserInteracted, collection.length]);

    // Resume auto-rotate after 10 seconds of no interaction
    useEffect(() => {
        if (isUserInteracted) {
            resumeTimeoutRef.current = setTimeout(() => {
                setIsUserInteracted(false);
            }, 10000);
        }

        return () => {
            if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
        };
    }, [isUserInteracted]);

    const activeAnime = collection[activeIndex];
    const youtubeId = activeAnime?.trailerUrl ? getYouTubeId(activeAnime.trailerUrl) : null;
    const displayImage = activeAnime?.bannerImage || activeAnime?.image;

    const handleCardClick = (index: number) => {
        setShowTrailer(false);
        setActiveIndex(index);
        setIsUserInteracted(true); // Pause auto-rotate temporarily after manual selection
    };

    return (
        <section
            className="px-4 md:px-8 py-20 relative z-10 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 relative z-20">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-[#33E092] text-xs font-bold tracking-[0.2em] uppercase">Vol. 01</span>
                        <div className="w-px h-4 dark:bg-zinc-700 bg-zinc-300" />
                        <span className="dark:text-zinc-500 text-zinc-600 text-xs tracking-wider uppercase">Hall of Fame</span>
                        <div className="flex-1 h-px dark:bg-zinc-800/50 bg-zinc-200" />
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-zinc-900 tracking-tight leading-none">
                        殿堂入り
                    </h2>
                    <p className="dark:text-zinc-600 text-zinc-500 text-sm mt-2 max-w-md">
                        Click any strip to explore. The selected anime expands to reveal its story.
                    </p>
                </header>

                {/* ==================== EXPANDED BANNER (Full Width) ==================== */}
                <div
                    className={`relative w-full overflow-hidden rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] mb-4
                        ${activeAnime ? 'h-[300px] md:h-[350px] lg:h-[400px] opacity-100' : 'h-0 opacity-0'}
                    `}
                >
                    {activeAnime && (
                        <>
                            {/* Full-width Banner Image */}
                            <img
                                src={displayImage}
                                alt={activeAnime.title}
                                className="w-full h-full object-cover object-center"
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                                loading="eager"
                            />

                            {/* Gradient overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Close button */}
                            <button
                                onClick={() => setActiveIndex(0)}
                                aria-label="Close expanded view"
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all z-20"
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>

                            {/* Content Overlay */}
                            <div className="absolute inset-0 flex items-center p-8 md:p-12">
                                <div className="max-w-xl">
                                    {/* Meta info */}
                                    <div className="flex items-center gap-3 text-xs text-zinc-300 mb-3">
                                        <span className="text-[#33E092] font-bold">{activeAnime.year}</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-500" />
                                        <span>{activeAnime.studio}</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-500" />
                                        <span>{activeAnime.episodes} eps</span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight drop-shadow-lg">
                                        {activeAnime.title}
                                    </h3>

                                    {/* Japanese title */}
                                    {activeAnime.title_jp && (
                                        <p className="text-zinc-400 text-sm mb-4">{activeAnime.title_jp}</p>
                                    )}

                                    {/* Rating & Genres */}
                                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                                        <div className="flex items-center gap-1.5">
                                            <FaStar className="w-4 h-4 text-yellow-400" />
                                            <span className="text-yellow-400 font-bold text-sm">{activeAnime.rating}</span>
                                        </div>
                                        {activeAnime.genres.slice(0, 3).map(g => (
                                            <span key={g} className="px-2.5 py-1 text-xs bg-white/10 text-zinc-200 rounded-lg backdrop-blur-sm">
                                                {g}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-zinc-300 leading-relaxed mb-4 line-clamp-2 md:line-clamp-3">
                                        {activeAnime.description}
                                    </p>

                                    {/* Quote */}
                                    {activeAnime.quote && (
                                        <div className="mb-4 pl-3 border-l-2 border-[#33E092]/60">
                                            <p className="text-xs italic text-zinc-200 leading-relaxed line-clamp-2">
                                                &ldquo;{activeAnime.quote}&rdquo;
                                            </p>
                                        </div>
                                    )}

                                    {/* OST Mini */}
                                    {activeAnime.ost && (
                                        <div className="flex items-center gap-3 mb-5">
                                            <FaMusic className="w-3 h-3 text-[#33E092]" />
                                            <div className="text-xs">
                                                <span className="text-white font-medium">{activeAnime.ost.name}</span>
                                                <span className="text-zinc-400 ml-1">by {activeAnime.ost.artist}</span>
                                            </div>
                                            {/* Plain icon buttons for OST */}
                                            <div className="flex items-center gap-3 ml-2">
                                                {activeAnime.ost.spotifyUrl && (
                                                    <a href={activeAnime.ost.spotifyUrl} target="_blank" rel="noopener noreferrer" aria-label="Listen on Spotify">
                                                        <FaSpotify className="w-4 h-4 text-zinc-300 hover:text-[#1DB954] transition-colors" />
                                                    </a>
                                                )}
                                                {activeAnime.ost.youtubeUrl && (
                                                    <a href={activeAnime.ost.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch on YouTube">
                                                        <FaYoutube className="w-5 h-5 text-zinc-300 hover:text-red-500 transition-colors" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-4">
                                        {youtubeId && (
                                            <button
                                                onClick={() => setShowTrailer(true)}
                                                aria-label="Watch trailer"
                                                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-all"
                                            >
                                                <FaPlay className="w-3 h-3" />
                                                Watch Trailer
                                            </button>
                                        )}
                                        {activeAnime.malUrl && (
                                            <a
                                                href={activeAnime.malUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-[#2E51A2]/80 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-[#2E51A2] transition-all"
                                            >
                                                <SiMyanimelist className="w-5 h-5" />
                                                MAL
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Trailer Overlay */}
                            {showTrailer && youtubeId && (
                                <div
                                    className="absolute inset-0 bg-black/95 flex items-center justify-center z-50 rounded-2xl"
                                    onClick={() => setShowTrailer(false)}
                                >
                                    <button
                                        onClick={() => setShowTrailer(false)}
                                        aria-label="Close trailer"
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-50"
                                    >
                                        <FaTimes className="w-4 h-4" />
                                    </button>
                                    <div className="w-full h-full max-w-4xl max-h-[90%] p-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                        <iframe
                                            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
                                            title={`${activeAnime.title} trailer`}
                                            className="w-full aspect-video rounded-xl"
                                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* ==================== SELECTION STRIPS ==================== */}
                <div className="flex gap-1.5 md:gap-2 h-[120px] md:h-[140px]">
                    {collection.map((anime, index) => {
                        const isActive = activeIndex === index;
                        const thumbImage = anime.bannerImage || anime.image;

                        return (
                            <div
                                key={anime.id}
                                onClick={() => handleCardClick(index)}
                                className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ease-out flex-1
                                    ${isActive
                                        ? 'ring-2 ring-[#33E092] ring-offset-2 ring-offset-zinc-900'
                                        : 'hover:ring-1 hover:ring-white/20'
                                    }
                                `}
                            >
                                {/* Thumbnail background (cropped preview) */}
                                <img
                                    src={thumbImage}
                                    alt={anime.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    loading="lazy"
                                />

                                {/* Overlay */}
                                <div className={`absolute inset-0 transition-all duration-300
                                    ${isActive
                                        ? 'bg-black/30'
                                        : 'bg-black/60 hover:bg-black/40'
                                    }
                                `} />

                                {/* Vertical title */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span
                                        className={`text-white text-[10px] md:text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all duration-300
                                            ${isActive ? 'opacity-70' : 'opacity-100'}
                                        `}
                                        style={{
                                            writingMode: 'vertical-rl',
                                            textOrientation: 'mixed',
                                            maxHeight: '90%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                                        }}
                                    >
                                        {anime.title}
                                    </span>
                                </div>

                                {/* Active indicator dot */}
                                {isActive && (
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#33E092]" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ==================== FOOTER INFO ==================== */}
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs dark:text-zinc-600 text-zinc-500">
                        <span className="text-[#33E092] font-bold">{collection.length}</span> anime in the hall of fame
                    </p>
                    <div className="flex items-center gap-2 text-xs dark:text-zinc-600 text-zinc-500">
                        <span className="w-2 h-2 rounded-full bg-[#33E092]/50 animate-pulse" />
                        <span>Click to explore</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
