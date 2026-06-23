'use client';

import React, { useState, useEffect } from 'react';
import './Pokedex3D.css';

// Interface matching MAL API response
interface MALAnime {
    id: number;
    title: string;
    title_jp?: string;
    image: string;
    rating: number;
    status: string;
    genres: string[];
    year: number;
    studio: string;
    episodes: number;
    episodesWatched: number;
    malUrl: string;
}

// Fallback type for legacy support
interface PokedexAnime {
    id: number;
    title: string;
    title_jp?: string;
    image: string;
    rating: number;
    status: string;
    genres: string[];
    year: number;
    episodes?: number;
    episodesWatched?: number;
    description: string;
    malUrl?: string;
    studio?: string;
}

interface Pokedex3DProps {
    watchlist?: PokedexAnime[];
    onAnimeSelect?: (anime: PokedexAnime | MALAnime) => void;
}

export default function Pokedex3D({ watchlist = [], onAnimeSelect }: Pokedex3DProps) {
    const [malAnimeList, setMalAnimeList] = useState<MALAnime[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [useMalData, setUseMalData] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAnimeIndex, setSelectedAnimeIndex] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [cameraAngle, setCameraAngle] = useState<'left' | 'center' | 'right'>('center');
    const [pressedButton, setPressedButton] = useState<number | null>(null);
    const [joystickDir, setJoystickDir] = useState<string | null>(null);

    // Fetch MAL watching data
    useEffect(() => {
        fetch('/api/mal?type=watching')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setMalAnimeList(data);
                    setUseMalData(true);
                }
            })
            .catch(err => console.error('Failed to fetch MAL watching data:', err))
            .finally(() => setIsLoading(false));
    }, []);

    // Use MAL data if available, otherwise fallback to prop data
    const displayedAnime = useMalData ? malAnimeList.slice(0, 4) : watchlist.slice(0, 4);
    const selectedAnime = displayedAnime[selectedAnimeIndex];

    // Helper to get description (MAL data doesn't have descriptions)
    const getDescription = () => {
        if (!selectedAnime) return 'No anime selected';
        if ('description' in selectedAnime && selectedAnime.description) {
            return selectedAnime.description;
        }
        // Generate anime details for MAL data
        const genres = selectedAnime.genres?.join(', ') || 'Unknown';
        const studio = selectedAnime.studio || 'Unknown Studio';
        const episodesWatched = selectedAnime.episodesWatched || 0;
        const totalEpisodes = selectedAnime.episodes || '?';
        const score = selectedAnime.rating ? `Score: ${selectedAnime.rating}/10.` : '';

        // Build description with episode progress
        let description = `${selectedAnime.title}. `;
        description += `Studio: ${studio}. `;
        description += `Genres: ${genres}. `;
        if (episodesWatched > 0) {
            description += `Progress: Episode ${episodesWatched} of ${totalEpisodes}. `;
        }
        if (score) {
            description += score;
        }
        return description;
    };

    // Open the Pokedex
    const handleOpen = () => {
        if (!isOpen) {
            setIsOpen(true);
        }
    };

    // Close the Pokedex
    const handleClose = () => {
        setIsOpen(false);
        setCameraAngle('center');
        setPressedButton(null);
    };

    // Navigate through anime list
    const handleNavigate = (direction: 'up' | 'down') => {
        if (!isOpen) return;

        if (direction === 'up' && selectedAnimeIndex > 0) {
            setSelectedAnimeIndex(selectedAnimeIndex - 1);
        } else if (direction === 'down' && selectedAnimeIndex < displayedAnime.length - 1) {
            setSelectedAnimeIndex(selectedAnimeIndex + 1);
        }
    };

    // Select anime and speak description
    const handleSelect = () => {
        if (!isOpen) return;

        if (selectedAnime) {
            onAnimeSelect?.(selectedAnime);
            // Speak the description using Web Speech API
            if ('speechSynthesis' in window && !isSpeaking) {
                // Cancel any ongoing speech
                window.speechSynthesis.cancel();
                setIsSpeaking(true);
                const utterance = new SpeechSynthesisUtterance(getDescription());
                utterance.rate = 0.9;
                utterance.pitch = 0.8;
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = () => setIsSpeaking(false);
                window.speechSynthesis.speak(utterance);
            }
        }
    };

    // Camera rotation
    const handleCamera = (direction: 'left' | 'center' | 'right') => {
        setCameraAngle(direction);
    };

    // Power toggle (speaks/stops current anime)
    const handlePower = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else if (selectedAnime) {
            handleSelect();
        }
    };

    // Button handlers for blue buttons
    const handleBlueButton = (num: number) => {
        if (!isOpen) return;

        switch (num) {
            case 1: // Rotate CCW
                handleCamera('left');
                break;
            case 2: // Center/Reset
                handleCamera('center');
                break;
            case 3: // Rotate CW
                handleCamera('right');
                break;
            case 4: // Lock/Close
                handleClose();
                break;
            case 5: // Power (toggle speech)
                handlePower();
                break;
            case 6: // GitHub
                window.open('https://github.com', '_blank');
                break;
            case 7: // LinkedIn
                window.open('https://linkedin.com', '_blank');
                break;
            case 8: // CodePen
                window.open('https://codepen.io', '_blank');
                break;
            case 9: // Package (npm/info)
                if (selectedAnime?.malUrl) {
                    window.open(selectedAnime.malUrl, '_blank');
                }
                break;
            case 10: // Server/API (MyAnimeList)
                window.open('https://myanimelist.net', '_blank');
                break;
        }
    };

    // Button press animation handlers
    const handleButtonPress = (num: number) => {
        setPressedButton(num);
    };

    const handleButtonRelease = () => {
        setPressedButton(null);
    };

    // Joystick press handlers
    const handleJoystickPress = (dir: string | null) => {
        setJoystickDir(dir);
        if (dir === 'up') handleNavigate('up');
        if (dir === 'down') handleNavigate('down');
    };

    // Get camera transform class
    const getCameraClass = () => {
        if (!isOpen) return '';
        if (cameraAngle === 'left') return 'ouvert ouvert-gauche';
        if (cameraAngle === 'right') return 'ouvert ouvert-droite';
        return 'ouvert';
    };

    return (
        <div className="pokedex-scene">
            <div className={`pokedex groupe-3d ${getCameraClass()}`} onClick={!isOpen ? handleOpen : undefined}>
                {/* Partie principale (Main body) */}
                <div className="partie-principale__face partie-principale__face--front">
                    <div className="relief">
                        <div className="relief-interieur">
                            <div className="conteneur">
                                <div className="flex-row">
                                    <div className={`led-rouge ${isOpen ? 'allume' : ''}`}></div>
                                    <div className={`led-bleue ${isSpeaking ? 'allume' : ''}`}></div>
                                </div>
                                <div className="ecran-vert flex-center">
                                    {isOpen && selectedAnime && (
                                        <div style={{ fontSize: 10, textAlign: 'center' }}>
                                            n° {selectedAnimeIndex + 1}<br />
                                            sur {displayedAnime.length}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="partie-principale__face partie-principale__face--back"></div>
                <div className="partie-principale__face partie-principale__face--right"></div>
                <div className="partie-principale__face partie-principale__face--left"></div>
                <div className="partie-principale__face partie-principale__face--top"></div>
                <div className="partie-principale__face partie-principale__face--bottom"></div>

                {/* Boitier blanc de l'écran (White screen housing) */}
                <div className="partie-blanche__face partie-blanche__face--front">
                    <div className="flex-col">
                        <div className="flex-row flex-center">
                            <div className="led-rouge"></div>
                            <div className="led-rouge"></div>
                        </div>
                        {/* ECRAN PRINCIPAL */}
                        <div className="ecran ecran-principal">
                            {!isOpen ? (
                                <div className="flex-center" style={{ height: '100%' }}>
                                    <p style={{ textAlign: 'center', fontSize: 11 }}>HANDY505</p>
                                </div>
                            ) : (
                                <div style={{ padding: 5 }}>
                                    <div className="flex-center" style={{ borderBottom: '1px solid white', marginBottom: 5 }}>
                                        <p style={{ fontSize: 11 }}>Watchlist</p>
                                    </div>
                                    {displayedAnime.map((anime, index) => (
                                        <div
                                            key={anime.id}
                                            onClick={(e) => { e.stopPropagation(); setSelectedAnimeIndex(index); }}
                                            style={{
                                                backgroundColor: index === selectedAnimeIndex ? 'yellow' : 'red',
                                                color: index === selectedAnimeIndex ? 'blue' : 'white',
                                                padding: '2px 5px',
                                                marginBottom: 2,
                                                fontSize: 10,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {anime.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="conteneur flex-row">
                            <div className="voyant-rouge"></div>
                            <div className="lignes">
                                <div className="ligne"></div>
                                <div className="ligne"></div>
                                <div className="ligne"></div>
                                <div className="ligne"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="partie-blanche__face partie-blanche__face--top"></div>
                <div className="partie-blanche__face partie-blanche__face--bottom"></div>
                <div className="partie-blanche__face partie-blanche__face--left"></div>
                <div className="partie-blanche__face partie-blanche__face--right"></div>
                <div className="partie-blanche__face partie-blanche__face--bottom-right"></div>

                {/* Joystick (D-pad) */}
                <div className={`joystick groupe-3d ${joystickDir ? `joystick-angle-${joystickDir}` : ''}`}>
                    <div className="joystick__face joystick__face--front">
                        <div
                            className="joystick-cliquable joystick-cliquable--top"
                            onMouseDown={() => handleJoystickPress('up')}
                            onMouseUp={() => handleJoystickPress(null)}
                            onMouseLeave={() => handleJoystickPress(null)}
                        ><div></div></div>
                        <div
                            className="joystick-cliquable joystick-cliquable--bottom"
                            onMouseDown={() => handleJoystickPress('down')}
                            onMouseUp={() => handleJoystickPress(null)}
                            onMouseLeave={() => handleJoystickPress(null)}
                        ><div></div></div>
                        <div
                            className="joystick-cliquable joystick-cliquable--left"
                            onMouseDown={() => handleJoystickPress('left')}
                            onMouseUp={() => handleJoystickPress(null)}
                            onMouseLeave={() => handleJoystickPress(null)}
                        ><div></div></div>
                        <div
                            className="joystick-cliquable joystick-cliquable--right"
                            onMouseDown={() => handleJoystickPress('right')}
                            onMouseUp={() => handleJoystickPress(null)}
                            onMouseLeave={() => handleJoystickPress(null)}
                        ><div></div></div>
                    </div>
                    <div className="joystick__face joystick__face--top"></div>
                    <div className="joystick__face joystick__face--bottom"></div>
                    <div className="joystick__face joystick__face--left"></div>
                    <div className="joystick__face joystick__face--right"></div>
                    <div className="joystick__face joystick__face--top-bord"></div>
                    <div className="joystick__face joystick__face--bottom-bord"></div>
                    <div className="joystick__face joystick__face--left-bord"></div>
                    <div className="joystick__face joystick__face--right-bord"></div>
                </div>

                {/* Boitier supérieur (Top casing with blue lens) */}
                <div className="boitier-superieur__face boitier-superieur__face--front">
                    <div className="flex-row">
                        <div className="gris"></div>
                        <div className="jaune"></div>
                        <div className={`rouge ${isSpeaking ? 'led-allume' : ''}`}></div>
                        <div className={`vert ${isOpen ? 'led-allume' : ''}`}></div>
                    </div>
                </div>
                <div className="boitier-superieur__face boitier-superieur__face--left"></div>
                <div className="boitier-superieur__face boitier-superieur__face--right"></div>
                <div className="boitier-superieur__face boitier-superieur__face--back"></div>
                <div className="boitier-superieur__face boitier-superieur__face--bottom-right"></div>
                <div className="boitier-superieur__face boitier-superieur__face--bottom-center"></div>
                <div className="boitier-superieur__face boitier-superieur__face--bottom-left"></div>

                {/* Lampe bleue (Blue lens - 9 faces) */}
                <div className="lampe-bleue__face lampe-bleue__face--front"></div>
                <div className="lampe-bleue__face lampe-bleue__face--top"></div>
                <div className="lampe-bleue__face lampe-bleue__face--bottom"></div>
                <div className="lampe-bleue__face lampe-bleue__face--left"></div>
                <div className="lampe-bleue__face lampe-bleue__face--right"></div>
                <div className="lampe-bleue__face lampe-bleue__face--bottom-left"></div>
                <div className="lampe-bleue__face lampe-bleue__face--bottom-right"></div>
                <div className="lampe-bleue__face lampe-bleue__face--top-left"></div>
                <div className="lampe-bleue__face lampe-bleue__face--top-right"></div>

                {/* Bouton noir (Black octagonal button) */}
                <div className="btn-noir groupe-3d">
                    <div
                        className={`groupe-3d ${pressedButton === -1 ? 'btn-enfonce' : ''}`}
                        onClick={(e) => { e.stopPropagation(); handleSelect(); }}
                        onPointerDown={(e) => { e.stopPropagation(); handleButtonPress(-1); }}
                        onPointerUp={(e) => { e.stopPropagation(); handleButtonRelease(); }}
                        onPointerLeave={handleButtonRelease}
                        onPointerCancel={handleButtonRelease}
                    >
                        <div className="btn-noir__face btn-noir__face--front"><div></div></div>
                        <div className="btn-noir__face btn-noir__face--left"></div>
                        <div className="btn-noir__face btn-noir__face--right"></div>
                        <div className="btn-noir__face btn-noir__face--top"></div>
                        <div className="btn-noir__face btn-noir__face--top-left"></div>
                        <div className="btn-noir__face btn-noir__face--top-right"></div>
                        <div className="btn-noir__face btn-noir__face--bottom"></div>
                        <div className="btn-noir__face btn-noir__face--bottom-left"></div>
                        <div className="btn-noir__face btn-noir__face--bottom-right"></div>
                    </div>
                </div>

                {/* Partie mobile (Hinge + Secondary panel) */}
                <div className="partie-mobile groupe-3d">
                    {/* Charnière (Hinge - 10 faces) */}
                    <div className="charniere__face charniere__face--top"></div>
                    <div className="charniere__face charniere__face--bottom"></div>
                    <div className="charniere__face charniere__face--front"></div>
                    <div className="charniere__face charniere__face--front-right"></div>
                    <div className="charniere__face charniere__face--front-left"></div>
                    <div className="charniere__face charniere__face--left"></div>
                    <div className="charniere__face charniere__face--right"></div>
                    <div className="charniere__face charniere__face--back"></div>
                    <div className="charniere__face charniere__face--back-right"></div>
                    <div className="charniere__face charniere__face--back-left"></div>

                    {/* Partie secondaire (Secondary panel) */}
                    <div className="partie-secondaire__face partie-secondaire__face--front" onClick={handleOpen}>
                        <div className="triangle"></div>
                        <div className="flex-center flex-col">
                            <div className="relief"></div>
                        </div>
                    </div>
                    <div className="partie-secondaire__face partie-secondaire__face--back">
                        <div className="relief">
                            <div className="relief-interieur flex-col">
                                {/* ECRAN SECONDAIRE */}
                                <div className="ecran ecran-secondaire">
                                    {isOpen && selectedAnime ? (
                                        <div style={{ padding: 5, fontSize: 10 }}>
                                            <p style={{ textAlign: 'center' }}><b>{selectedAnime.title}</b></p>
                                            <p style={{ marginTop: 5, lineHeight: 1.2 }}>
                                                {getDescription().slice(0, 80)}...
                                            </p>
                                        </div>
                                    ) : (
                                        <div style={{ padding: 5, fontSize: 10 }}>
                                            <p>Welcome to Anime Dex!</p>
                                            <ul style={{ marginLeft: 10, marginTop: 5 }}>
                                                <li>Navigate with D-pad</li>
                                                <li>Select with ✓</li>
                                                <li>Back with ←</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="conteneur flex-col">
                                    <div className="flex-row">
                                        <div className="truc-noir"></div>
                                        <div className="truc-noir"></div>
                                    </div>
                                    <div className="voyant-jaune"></div>
                                </div>
                                <div className="flex-row">
                                    <div className="petit-ecran flex-center">
                                        {isOpen && <div style={{ fontSize: 9 }}>anime</div>}
                                    </div>
                                    <div className="petit-ecran flex-center">
                                        {isOpen && <div style={{ fontSize: 9 }}>{selectedAnimeIndex} - 0</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="partie-secondaire__face partie-secondaire__face--right"></div>
                    <div className="partie-secondaire__face partie-secondaire__face--left"></div>
                    <div className="partie-secondaire__face partie-secondaire__face--bottom"></div>
                    <div className="partie-secondaire__face partie-secondaire__face--top-left"></div>
                    <div className="partie-secondaire__face partie-secondaire__face--top-center"></div>
                    <div className="partie-secondaire__face partie-secondaire__face--top-right"></div>

                    {/* Boutons bleus (Blue buttons - 10 buttons with 5 faces each) */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <div
                            key={num}
                            className={`bouton-carre btn-bleu bouton-carre-${num} groupe-3d ${pressedButton === num ? 'btn-enfonce' : ''}`}
                            onClick={(e) => { e.stopPropagation(); handleBlueButton(num); }}
                            onPointerDown={(e) => { e.stopPropagation(); handleButtonPress(num); }}
                            onPointerUp={(e) => { e.stopPropagation(); handleButtonRelease(); }}
                            onPointerLeave={handleButtonRelease}
                            onPointerCancel={handleButtonRelease}
                        >
                            <div className="bouton-carre__face bouton-carre__face--front flex-center">
                                <img
                                    src={`/pokedex/svg/${getButtonIcon(num)}.svg`}
                                    alt={getButtonLabel(num)}
                                    style={{ height: 20, filter: 'brightness(0) invert(1)' }}
                                />
                            </div>
                            <div className="bouton-carre__face bouton-carre__face--top"></div>
                            <div className="bouton-carre__face bouton-carre__face--bottom"></div>
                            <div className="bouton-carre__face bouton-carre__face--left"></div>
                            <div className="bouton-carre__face bouton-carre__face--right"></div>
                        </div>
                    ))}

                    {/* Boutons blancs (White buttons - return and check) */}
                    <div
                        className={`bouton-carre btn-blanc bouton-carre-11 groupe-3d ${pressedButton === 11 ? 'btn-enfonce' : ''}`}
                        onClick={(e) => { e.stopPropagation(); handleClose(); }}
                        onPointerDown={(e) => { e.stopPropagation(); handleButtonPress(11); }}
                        onPointerUp={(e) => { e.stopPropagation(); handleButtonRelease(); }}
                        onPointerLeave={handleButtonRelease}
                        onPointerCancel={handleButtonRelease}
                    >
                        <div className="bouton-carre__face bouton-carre__face--front flex-center">
                            <img src="/pokedex/svg/return.svg" alt="Return" style={{ height: 20 }} />
                        </div>
                        <div className="bouton-carre__face bouton-carre__face--top"></div>
                        <div className="bouton-carre__face bouton-carre__face--bottom"></div>
                        <div className="bouton-carre__face bouton-carre__face--left"></div>
                        <div className="bouton-carre__face bouton-carre__face--right"></div>
                    </div>
                    <div
                        className={`bouton-carre btn-blanc bouton-carre-12 groupe-3d ${pressedButton === 12 ? 'btn-enfonce' : ''}`}
                        onClick={(e) => { e.stopPropagation(); handleSelect(); }}
                        onPointerDown={(e) => { e.stopPropagation(); handleButtonPress(12); }}
                        onPointerUp={(e) => { e.stopPropagation(); handleButtonRelease(); }}
                        onPointerLeave={handleButtonRelease}
                        onPointerCancel={handleButtonRelease}
                    >
                        <div className="bouton-carre__face bouton-carre__face--front flex-center">
                            <img src="/pokedex/svg/check.svg" alt="OK" style={{ height: 20 }} />
                        </div>
                        <div className="bouton-carre__face bouton-carre__face--top"></div>
                        <div className="bouton-carre__face bouton-carre__face--bottom"></div>
                        <div className="bouton-carre__face bouton-carre__face--left"></div>
                        <div className="bouton-carre__face bouton-carre__face--right"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper function to get button icons
function getButtonIcon(num: number): string {
    const icons: Record<number, string> = {
        1: 'rotate-ccw',
        2: 'minus',
        3: 'rotate-cw',
        4: 'lock',
        5: 'power',
        6: 'github',
        7: 'linkedin',
        8: 'codepen',
        9: 'package',
        10: 'server'
    };
    return icons[num] || 'minus';
}

// Helper function to get button labels for accessibility
function getButtonLabel(num: number): string {
    const labels: Record<number, string> = {
        1: 'Rotate Left',
        2: 'Center View',
        3: 'Rotate Right',
        4: 'Close Pokedex',
        5: 'Power/Speak',
        6: 'GitHub',
        7: 'LinkedIn',
        8: 'CodePen',
        9: 'More Info',
        10: 'MyAnimeList'
    };
    return labels[num] || '';
}
