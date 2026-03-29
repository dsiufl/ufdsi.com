export default function StepIndicator({ total, current }: { total: number; current: number }) {
    return (
        <div className="flex flex-col items-center">
            {Array.from({ length: total }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div
                        className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-colors ${
                            i <= current
                                ? 'bg-white border-white text-gray-900'
                                : 'border-white/30 text-white/30'
                        }`}
                    >
                        {i + 1}
                    </div>
                    {i < total - 1 && (
                        <div
                            className={`w-px h-14 transition-colors ${
                                i < current ? 'bg-white/60' : 'bg-white/20'
                            }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
