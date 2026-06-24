"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
    BiUser,
    BiPen,
    BiBookBookmark,
    BiJoystick,
    BiCodeBlock,
    BiPalette
} from "react-icons/bi"


const navLinks = [
    { label: "Myself", href: "/myself", icon: BiUser },
    { label: "Studio", href: "/studio", icon: BiPalette },
    { label: "Workspace", href: "/workspace", icon: BiCodeBlock },
    { label: "Ink", href: "/ink", icon: BiPen },
    { label: "Edu", href: "/edu", icon: BiBookBookmark },
    { label: "Hobbies", href: "/hobbies", icon: BiJoystick },
]


function useWeather() {
    const [weather, setWeather] = useState<{ temp: number; city: string } | null>(null)

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY
                const city = process.env.NEXT_PUBLIC_WEATHERAPI_CITY || "YourCity"

                if (!apiKey || apiKey === "your_weatherapi_key_here") {
                    setWeather({ temp: 22, city: "Mysore" })
                    return
                }

                const res = await fetch(
                    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
                )

                if (res.ok) {
                    const data = await res.json()
                    setWeather({
                        temp: Math.round(data.current.temp_c),
                        city: data.location.name,
                    })
                } else {
                    setWeather({ temp: 22, city: "Mysore" })
                }
            } catch (error) {
                console.error("Weather fetch error:", error)
                setWeather({ temp: 22, city: "Mysore" })
            }
        }

        fetchWeather()
    }, [])

    return weather
}


// ── Default icon: blue unvisited Pokéstop (inlined from D:\EdgeDev\pokestop.svg) ──
function PokestopBlue({ size }: { size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 127.852 127.852"
            fill="none"
            aria-hidden="true"
        >
            {/* Upper hexagonal disc — 3 faces for isometric depth */}
            <polygon fill="#8DE4FF" points="36.174,17.522 63.926,1.5 91.678,17.522 91.678,49.572 63.926,65.592 36.174,49.572" />
            <polyline fill="#36C6FF" points="36.174,17.522 63.926,1.5 91.678,17.522 91.678,49.572 63.926,65.592" />
            <polygon fill="#0086FF" points="63.925,1.5 63.925,65.592 63.926,65.592 91.678,49.572 91.678,17.522 63.926,1.5" />
            <polyline fill="#0062FF" points="91.678,17.522 63.926,1.5 63.925,1.5 63.925,65.592 63.926,65.592" />
            <polygon fill="#36C6FF" points="36.174,17.522 36.174,17.524 63.926,33.546 91.678,17.524 91.678,17.522 63.926,1.5" />
            <polyline fill="#00AAFF" points="36.174,17.522 36.174,17.524 63.926,33.546 91.678,17.524 91.678,17.522" />
            {/* Lower connector ring */}
            <polygon fill="#0062FF" points="45.077,90.853 45.077,90.855 63.926,101.737 82.775,90.855 82.775,90.853 63.926,79.972" />
            <polyline fill="#0031FF" points="63.926,101.737 82.775,90.855 82.775,90.853 63.926,79.972" />
            {/* Bottom anchor dot */}
            <circle fill="#36C6FF" cx="63.926" cy="121.193" r="5.16" />
            <path fill="#0086FF" d="M63.926,116.032c2.85,0,5.16,2.311,5.16,5.16c0,2.851-2.31,5.159-5.16,5.159" />
            {/* Dark outlines */}
            <path fill="#33363A" d="M63.926,127.852c-3.672,0-6.66-2.987-6.66-6.659c0-3.672,2.987-6.66,6.66-6.66
                s6.66,2.988,6.66,6.66C70.586,124.865,67.598,127.852,63.926,127.852z M63.926,117.532c-2.018,0-3.66,1.642-3.66,3.66
                c0,2.018,1.642,3.659,3.66,3.659s3.66-1.642,3.66-3.659C67.586,119.175,65.944,117.532,63.926,117.532z" />
            <path fill="#33363A" d="M83.525,89.553L64.676,78.673c-0.464-0.268-1.036-0.268-1.5,0L44.327,89.553
                c-0.464,0.268-0.75,0.764-0.75,1.3s0.286,1.032,0.75,1.3l18.099,10.449v5.015c0,0.829,0.671,1.5,1.5,1.5s1.5-0.671,1.5-1.5
                v-5.015l18.099-10.451c0.464-0.268,0.75-0.763,0.75-1.299C84.275,90.317,83.989,89.822,83.525,89.553z
                M63.926,100.005l-15.849-9.152l15.849-9.149l15.849,9.151L63.926,100.005z" />
            <path fill="#33363A" d="M62.866,110.846c-0.28,0.28-0.44,0.66-0.44,1.06c0,0.39,0.16,0.78,0.44,1.06
                c0.28,0.28,0.67,0.44,1.06,0.44c0.4,0,0.78-0.16,1.06-0.44c0.28-0.28,0.44-0.67,0.44-1.06c0-0.4-0.16-0.79-0.44-1.06
                C64.436,110.286,63.426,110.276,62.866,110.846z" />
            <path fill="#33363A" d="M93.17,17.462c-0.004-0.089-0.015-0.177-0.035-0.264c-0.008-0.034-0.013-0.068-0.023-0.101
                c-0.03-0.101-0.07-0.199-0.123-0.295c-0.012-0.023-0.026-0.044-0.04-0.066c-0.054-0.087-0.115-0.167-0.183-0.239
                c-0.028-0.029-0.058-0.055-0.088-0.082c-0.061-0.055-0.124-0.104-0.192-0.147c-0.021-0.013-0.037-0.033-0.059-0.045
                L64.676,0.201c-0.464-0.269-1.036-0.269-1.5,0L35.424,16.223c-0.023,0.013-0.039,0.033-0.061,0.047
                c-0.066,0.042-0.128,0.09-0.187,0.143c-0.031,0.028-0.063,0.054-0.092,0.085c-0.067,0.072-0.128,0.151-0.182,0.237
                c-0.014,0.022-0.028,0.044-0.04,0.067c-0.053,0.096-0.093,0.194-0.123,0.295c-0.01,0.033-0.015,0.067-0.023,0.101
                c-0.02,0.088-0.031,0.176-0.035,0.264c-0.001,0.02-0.008,0.039-0.008,0.06v32.05c0,0.536,0.286,1.031,0.75,1.299
                l27.002,15.588v4.15c0,0.829,0.671,1.5,1.5,1.5s1.5-0.671,1.5-1.5v-4.15l27.002-15.588c0.464-0.268,0.75-0.763,0.75-1.299
                v-32.05C93.178,17.501,93.171,17.482,93.17,17.462z
                M63.926,3.232L88.68,17.523L63.926,31.814L39.172,17.523L63.926,3.232z
                M37.674,20.122l24.752,14.29v28.582L37.674,48.705V20.122z
                M65.426,62.994V34.412l24.752-14.29v28.584L65.426,62.994z" />
            <path fill="#33363A" d="M62.866,73.836c-0.28,0.28-0.44,0.66-0.44,1.06c0,0.39,0.16,0.78,0.44,1.06
                c0.28,0.28,0.66,0.44,1.06,0.44c0.4,0,0.78-0.16,1.06-0.44c0.28-0.28,0.44-0.67,0.44-1.06c0-0.4-0.16-0.78-0.44-1.06
                C64.436,73.276,63.426,73.276,62.866,73.836z" />
        </svg>
    )
}

// ── Hover icon: violet visited Pokéstop (Icons8 color CDN) ──
function PokestopViolette({ size }: { size: number }) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src="https://img.icons8.com/color/96/pokestop-violette.png"
            alt=""
            width={size}
            height={size}
            aria-hidden="true"
        />
    )
}

// Both icons stacked — crossfade driven by parent group hover.
const ICON_SIZE = 48

function PokestopIcon() {
    return (
        <span
            className="relative shrink-0 block"
            style={{ width: ICON_SIZE, height: ICON_SIZE }}
        >
            <span className="absolute inset-0 transition-opacity duration-300 ease-in-out group-hover:opacity-0">
                <PokestopBlue size={ICON_SIZE} />
            </span>
            <span className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                <PokestopViolette size={ICON_SIZE} />
            </span>
        </span>
    )
}

// ── Quote block ──
// Default text stays in normal flow so the parent has a real width.
// Hover text is absolutely overlaid on top — avoids the absolute-only-children
// width-collapse bug that made the text invisible.
// Both fade + shift 4 px on the same 300 ms timing as the icon crossfade.
function PokestopQuote() {
    return (
        <div className="relative min-w-0">
            {/* Default copy — in normal flow, gives the parent its natural size */}
            <div className="transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:-translate-y-1">
                <p className="font-incognito font-medium italic text-sm dark:text-white text-gray-900 whitespace-nowrap">
                    The next stop is calling.
                </p>
                <p className="text-xs dark:text-gray-500 text-gray-500 whitespace-nowrap mt-0.5">
                    Find my next destination
                </p>
            </div>

            {/* Hover copy — overlaid absolutely, same dimensions */}
            <div className="absolute inset-0 translate-y-1 opacity-0
                transition-all duration-300 ease-in-out
                group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-incognito font-medium italic text-sm text-[#33E092] whitespace-nowrap">
                    Every road, a story.
                </p>
                <p className="text-xs dark:text-gray-500 text-gray-500 whitespace-nowrap mt-0.5">
                    See where I&apos;ve been
                </p>
            </div>
        </div>
    )
}


export function NavigationIcons() {
    const weather = useWeather()

    return (
        <section className="mt-20 mb-8 border-t dark:border-gray-800 border-gray-200 pt-8">

            <div className="flex items-center justify-between mb-8">

                {/* Travel button — group drives both icon crossfade and quote slide */}
                <Link href="/myself/gallery" className="flex items-center gap-3 group">
                    <PokestopIcon />
                    <PokestopQuote />
                </Link>

                {/* Weather chip */}
                <div className="shrink-0 px-3 py-1.5 rounded-md border dark:border-gray-700 border-gray-400 dark:bg-neutral-900 bg-[#d5d5da]">
                    <span className="text-sm font-medium dark:text-white text-gray-900">
                        {weather ? `${weather.temp}°C` : "..."}
                    </span>
                </div>
            </div>

            {/* Section nav links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-4">
                {navLinks.map((link) => {
                    const Icon = link.icon
                    return (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="flex items-center gap-2 dark:text-gray-400 text-gray-600 hover:text-[#38A662] dark:hover:text-[#38A662] transition-colors text-sm"
                        >
                            <Icon className="w-4 h-4" />
                            {link.label}
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default NavigationIcons
