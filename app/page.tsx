'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/lib/LanguageContext';

// 动态导入图表组件，避免 SSR 问题
const ProgressChart = dynamic(() => import('@/components/ProgressChart'), {
    ssr: false,
    loading: () => (
        <div className="py-16 px-4 bg-slate-50">
            <div className="max-w-7xl mx-auto text-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto mb-8"></div>
                    <div className="h-96 bg-slate-200 rounded"></div>
                </div>
            </div>
        </div>
    ),
});

const StatsOverview = dynamic(() => import('@/components/StatsOverview'), {
    ssr: false,
    loading: () => (
        <div className="py-12 px-4 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse">
                            <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ),
});

export default function Home() {
    const { t } = useLanguage();

    // 占位数据 - 后续会从 data.json 读取
    const benchmarks = [
        {
            id: 'libero',
            name: t.benchmarkDesc.libero.name,
            description: t.benchmarkDesc.libero.description,
            metric: t.benchmarkDesc.libero.metric,
            modelCount: 54,
            topModels: [
                { rank: 1, name: 'SimpleVLA-RL', score: 99.1 },
                { rank: 2, name: 'VLA-Adapter-pro', score: 98.5 },
                { rank: 3, name: 'AVA-VLA', score: 98.3 },
                { rank: 4, name: 'X-VLA', score: 98.1 },
                { rank: 5, name: 'VOTE', score: 98.0 },
            ],
            color: 'blue',
        },
        {
            id: 'calvin',
            name: t.benchmarkDesc.calvin.name,
            description: t.benchmarkDesc.calvin.description,
            metric: t.benchmarkDesc.calvin.metric,
            modelCount: 34,
            topModels: [
                { rank: 1, name: 'AVA-VLA', score: 4.65 },
                { rank: 2, name: 'Flower VLA', score: 4.53 },
                { rank: 3, name: 'DreamVLA', score: 4.44 },
                { rank: 4, name: 'X-VLA', score: 4.43 },
                { rank: 5, name: 'UniVLA', score: 4.41 },
            ],
            color: 'green',
        },
        {
            id: 'metaworld',
            name: t.benchmarkDesc.metaworld.name,
            description: t.benchmarkDesc.metaworld.description,
            metric: t.benchmarkDesc.metaworld.metric,
            modelCount: 11,
            topModels: [
                { rank: 1, name: 'MPI', score: 86.0 },
                { rank: 2, name: 'iRe-VLA', score: 83.0 },
                { rank: 3, name: 'Evo-1', score: 80.6 },
                { rank: 4, name: 'Baku', score: 79.0 },
                { rank: 5, name: 'TriVLA', score: 71.4 },
            ],
            color: 'purple',
        },
    ];

    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-600',
            badge: 'bg-blue-100 text-blue-800',
            button: 'bg-blue-600 hover:bg-blue-700',
        },
        green: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-600',
            badge: 'bg-emerald-100 text-emerald-800',
            button: 'bg-emerald-600 hover:bg-emerald-700',
        },
        purple: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-600',
            badge: 'bg-purple-100 text-purple-800',
            button: 'bg-purple-600 hover:bg-purple-700',
        },
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {t.home.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 mb-6">
                        {t.home.subtitle}
                    </p>
                    <p className="text-slate-400 max-w-3xl mx-auto mb-8">
                        {t.home.description}
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            href="/benchmarks/libero"
                            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
                        >
                            {t.home.viewLeaderboard}
                        </Link>
                        <Link
                            href="/methodology"
                            className="px-6 py-3 border border-slate-500 hover:border-slate-400 rounded-lg font-medium transition-colors"
                        >
                            {t.common.learnMore}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Overview */}
            <StatsOverview />

            {/* Benchmark Cards */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
                        {t.nav.benchmarks}
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {benchmarks.map((benchmark) => {
                            const colors = colorClasses[benchmark.color as keyof typeof colorClasses];
                            return (
                                <div
                                    key={benchmark.id}
                                    className={`rounded-xl border-2 ${colors.border} ${colors.bg} overflow-hidden card-hover`}
                                >
                                    {/* Card Header */}
                                    <div className="p-6 border-b border-slate-200 bg-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className={`text-xl font-bold ${colors.text}`}>
                                                {benchmark.name}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                                                {benchmark.modelCount} {t.home.models}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 line-clamp-2">
                                            {benchmark.description}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-2">
                                            {t.home.primaryMetric}: {benchmark.metric}
                                        </p>
                                    </div>

                                    {/* Top Models */}
                                    <div className="p-4">
                                        <h4 className="text-sm font-semibold text-slate-700 mb-3">
                                            {t.home.topPerformers}
                                        </h4>
                                        <div className="space-y-2">
                                            {benchmark.topModels.map((model) => (
                                                <div
                                                    key={model.rank}
                                                    className="flex items-center justify-between bg-white rounded-lg px-3 py-2 shadow-sm"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <span
                                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${model.rank === 1
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : model.rank === 2
                                                                    ? 'bg-gray-100 text-gray-600'
                                                                    : model.rank === 3
                                                                        ? 'bg-orange-100 text-orange-700'
                                                                        : 'bg-slate-100 text-slate-600'
                                                                }`}
                                                        >
                                                            {model.rank}
                                                        </span>
                                                        <span className="font-medium text-slate-800 text-sm">
                                                            {model.name}
                                                        </span>
                                                    </div>
                                                    <span className={`font-mono text-sm ${colors.text}`}>
                                                        {model.score}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="p-4 pt-0">
                                        <Link
                                            href={`/benchmarks/${benchmark.id}`}
                                            className={`block w-full text-center py-2 rounded-lg text-white font-medium transition-colors ${colors.button}`}
                                        >
                                            {t.home.viewLeaderboard}
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Progress Chart Section */}
            <ProgressChart />
        </div>
    );
}