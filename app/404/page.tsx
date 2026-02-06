import Link from 'next/link'
import CustomMapMarker from '@/app/components/map/CustomMapMarker'

function ArrowLeftIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
        >
            <path
                d="M15.833 10H4.167M4.167 10L10 15.833M4.167 10L10 4.167"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

const SUGGESTED_PAGES = [
    { href: '/virtual-map', label: 'Virtual Map' },
    { href: '/all-sites', label: 'All Sites' },
    { href: '/tours', label: 'Guided Tours' },
    { href: '/about-us', label: 'About the DEO' },
    { href: '/team', label: 'Meet the Team' },
] as const

export default function Error404Page() {
    return (
        <div className="min-h-[100dvh] w-full bg-white text-black">
            <main className="mx-auto flex min-h-[100dvh] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
                {/* <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-black/70">
                    Error Code: 404
                </div> */}

                {/* Big custom 404 */}
                <div className="relative mt-7 select-none">
                    <span className="sr-only">404</span>
                    <div className="flex items-end justify-center gap-15 max-sm:gap-3">
                        <span
                            aria-hidden
                            className="bg-gradient-to-b from-[#007BFF] to-[#66B2FF] bg-clip-text font-black leading-none tracking-tight text-transparent max-sm:text-[9rem] text-[15rem]"
                        >
                            4
                        </span>

                        <div className="relative -translate-y-33 translate-x-3 rotate-10 scale-[3.5] max-sm:scale-[1.2]">
                            <CustomMapMarker
                                name="0"
                                pointimage="https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/bathseba-1.JPG"
                                color="linear-gradient(135deg, #66B2FF, #007BFF)"
                            />
                        </div>

                        <span
                            aria-hidden
                            className="bg-gradient-to-b from-[#007BFF] to-[#66B2FF] bg-clip-text font-black leading-none tracking-tight text-transparent max-sm:text-[9rem] text-[15rem]"
                        >
                            4
                        </span>
                    </div>
                </div>

                <p className="mt-5 text-3xl font-bold leading-tight text-blod max-sm:text-[1rem]">
                    Seems like you took a wrong turn.
                </p>
                {/* <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/70 sm:text-base">
                    The link might be broken, or the page may have moved. Head
                    back home or jump into a nearby route.
                </p> */}

                <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
                    <div
                className={`cursor-pointer rounded-full p-[2.5px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] active:scale-[.98] transition-transform hover:scale-[1.02] active:scale-[0.99]`}
            >
                    <Link
                        href="/"
                        className="flex justify-center items-center gap-[10px] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[30px] py-[15px] text-white font-bold"
                    >
                        <ArrowLeftIcon className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                        Go Back Home
                    </Link>
                    </div>
                    {/* <Link
                        href="/explore"
                        className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 font-semibold text-black/80 shadow-[0px_10px_22px_rgba(2,6,23,0.06)] transition-colors hover:bg-black/[0.02] sm:w-auto"
                    >
                        Explore
                    </Link> */}
                </div>

                <section className="absolute bottom-0 mt-10 w-full max-w-2xl rounded-[32px] bg-white p-6 sm:p-7">
                    <p className="text-sm font-semibold text-black/70">
                        Try these pages
                    </p>
                    <nav aria-label="Try these pages">
                        <ul className="mt-6 flex flex-wrap justify-center gap-6 bg-red-500/0">
                            {SUGGESTED_PAGES.map((page) => (
                                <li key={page.href}>
                                    <Link
                                        href={page.href}
                                        className="group flex items-center rounded-2xl transition-colors hover:bg-black/[0.02]"
                                    >
                                        <span className="font-semibold text-black">
                                            {page.label}
                                        </span>
                                        {/* <span className="text-black/40 transition-transform group-hover:translate-x-0.5">
                                            →
                                        </span> */}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </section>

                {/* <p className="mt-10 text-xs text-black/50">
                    If you typed the address, double-check the spelling and try
                    again.
                </p> */}
            </main>
        </div>
    )
}
