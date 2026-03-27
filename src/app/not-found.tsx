import Link from "next/link";

export default function page() {
    return (
        <div className="p-[10%] w-full flex items-center justify-center flex-col">
            <h1 className="text-4xl font-bold"><span className="text-primary">404</span> - Page not found</h1>
            <p className="mt-4 text-lg">The page you are looking for does not exist.</p>
            <Link href="/" className="button mt-6 px-4 py-2 text-white rounded transition">Go back home</Link>
        </div>
    )
}