"use client"

import { useState } from "react"
import Image from "next/image"
import { FiCamera } from "react-icons/fi"

interface Photo {
    id: string
    src: string
    alt: string
    category: string
}

function ComingSoon() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-16 h-16 mb-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <FiCamera className="w-8 h-8 text-zinc-400" />
            </div>
            <h2 className="font-incognito text-2xl font-semibold dark:text-zinc-300 text-zinc-600 mb-2">
                Coming Soon
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                A visual journey through moments, places, and memories. Photos and captures will be curated here.
            </p>
        </div>
    )
}

export function GalleryClient({ categories, photos }: { categories: string[]; photos: Photo[] }) {
    const [activeCategory, setActiveCategory] = useState("All")

    const visiblePhotos =
        activeCategory === "All" ? photos : photos.filter((photo) => photo.category === activeCategory)

    return (
        <>
            {photos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 mb-12" role="group" aria-label="Filter photos by category">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setActiveCategory(category)}
                            aria-pressed={activeCategory === category}
                            className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                                activeCategory === category
                                    ? "border-zinc-900 dark:border-[#33E092] bg-zinc-900 dark:bg-[#33E092] text-white dark:text-black"
                                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            {visiblePhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {visiblePhotos.map((photo) => (
                        <div
                            key={photo.id}
                            className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                        >
                            <Image
                                src={photo.src}
                                alt={photo.alt}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white text-sm font-medium truncate">{photo.alt}</p>
                                <p className="text-white/70 text-xs">{photo.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : photos.length > 0 ? (
                <p className="text-center text-zinc-500 dark:text-zinc-400 py-20">
                    No photos in this category yet.
                </p>
            ) : (
                <ComingSoon />
            )}
        </>
    )
}
