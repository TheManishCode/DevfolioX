export default function GuestbookLoading() {
    return (
        <main className="max-w-3xl mx-auto pt-20 lg:pt-28 pb-20 px-6 sm:px-8 md:px-12 lg:px-16 animate-pulse">
            <section className="mb-12">
                <div className="h-12 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-6" />
                <div className="h-4 w-96 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </section>

            <section className="mb-12">
                <div className="p-6 rounded-xl border dark:border-zinc-800/50 border-zinc-200/50 h-40 bg-zinc-50 dark:bg-zinc-900/30" />
            </section>

            <section className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl border dark:border-zinc-800/30 border-zinc-200/30">
                        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                        <div className="flex-1 space-y-2 pt-1">
                            <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                            <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                            <div className="h-3 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        </div>
                    </div>
                ))}
            </section>
        </main>
    )
}
