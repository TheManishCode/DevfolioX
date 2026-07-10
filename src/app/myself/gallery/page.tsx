import { Metadata } from "next"
import { PageHeader } from "@/components/layout/PageHeader"
import { getContent } from "@/lib/content"
import galleryData from "@/data/gallery.json"
import { GalleryClient } from "./GalleryClient"

export const metadata: Metadata = {
    title: "Gallery | Myself",
    description: "A collection of photos capturing moments, travels, and memories.",
}

export default async function GalleryPage() {
    const content = await getContent("gallery", galleryData)

    return (
        <main className="max-w-7xl mx-auto pt-20 lg:pt-28 pb-20 px-6 sm:px-8 md:px-12 lg:px-16">
            <PageHeader
                title="Gallery"
                description="A visual journey through moments, places, and memories that inspire me."
            />

            <GalleryClient categories={content.categories} photos={content.photos} />
        </main>
    )
}
