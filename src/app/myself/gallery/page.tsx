import { Metadata } from "next"
import { PageHeader } from "@/components/layout/PageHeader"
import { FiImage, FiGrid, FiCamera } from "react-icons/fi"
import galleryData from "@/data/gallery.json"

export const metadata: Metadata = {
    title: "Gallery | Myself",
    description: "A collection of photos capturing moments, travels, and memories.",
}

const categories = galleryData.categories

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

const photos = galleryData.photos as Photo[]

export default function GalleryPage() {
    return (
        <main className="max-w-7xl mx-auto pt-20 lg:pt-28 pb-20 px-6 sm:px-8 md:px-12 lg:px-16">
            <PageHeader
                title="Gallery"
                description="A visual journey through moments, places, and memories that inspire me."
            />

            {/* Category Filter (ready for future use) */}
            {photos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className="px-4 py-2 text-sm font-medium rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            {photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                        >
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white text-sm font-medium truncate">{photo.alt}</p>
                                <p className="text-white/70 text-xs">{photo.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <ComingSoon />
            )}
        </main>
    )
}
