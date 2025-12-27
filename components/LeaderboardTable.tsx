'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface LeaderboardEntry {
    rank: number;
    name: string;
    paper_url: string | null;
    pub_date: string | null;
    average?: number | null;
    avg_len?: number | null;
    source?: string;
    [key: string]: any;
}

interface LeaderboardTableProps {
    data: LeaderboardEntry[];
    scoreKey: 'average' | 'avg_len';
    detailKeys?: string[];
    detailLabels?: Record<string, string>;
}

export default function LeaderboardTable({
    data,
    scoreKey,
    detailKeys = [],
    detailLabels = {},
}: LeaderboardTableProps) {
    const { t } = useLanguage();
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [yearFilter, setYearFilter] = useState<string>('all');

    // 获取所有可用年份
    const years = Array.from(
        new Set(
            data
                .map((item) => item.pub_date?.split('-')[0])
                .filter((year): year is string => year !== undefined)
        )
    ).sort((a, b) => b.localeCompare(a));

    // 过滤数据
    const filteredData = yearFilter === 'all'
        ? data
        : data.filter((item) => item.pub_date?.startsWith(yearFilter));

    const toggleExpand = (rank: number) => {
        setExpandedRow(expandedRow === rank ? null : rank);
    };

    const formatScore = (score: number | null | undefined) => {
        if (score === null || score === undefined) return '-';
        return score.toFixed(2);
    };

    const getRankBadgeClass = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 2:
                return 'bg-gray-100 text-gray-600 border-gray-300';
            case 3:
                return 'bg-orange-100 text-orange-700 border-orange-300';
            default:
                return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="space-y-4">
            {/* Filter */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <label className="text-sm text-slate-600">{t.benchmark.filterByYear}:</label>
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">{t.benchmark.allYears}</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <span className="text-sm text-slate-500">
                    {filteredData.length} {t.home.models}
                </span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-16">
                                {t.benchmark.rank}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                {t.benchmark.model}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">
                                {t.benchmark.score}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-28">
                                {t.benchmark.date}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-20">
                                {t.benchmark.paper}
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-20">
                                {t.benchmark.details}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                    {t.benchmark.noData}
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item) => (
                                <>
                                    <tr
                                        key={item.rank}
                                        className="table-row-hover cursor-pointer transition-colors"
                                        onClick={() => toggleExpand(item.rank)}
                                    >
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${getRankBadgeClass(
                                                    item.rank
                                                )}`}
                                            >
                                                {item.rank}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-slate-800">{item.name}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-primary-600 font-semibold">
                                                {formatScore(item[scoreKey])}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 text-sm">
                                            {item.pub_date || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.paper_url ? (
                                                <a
                                                    href={item.paper_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary-600 hover:text-primary-800 text-sm"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Link
                                                </a>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                className="text-slate-400 hover:text-slate-600"
                                                aria-label={expandedRow === item.rank ? t.benchmark.hideDetails : t.benchmark.showDetails}
                                            >
                                                <svg
                                                    className={`w-5 h-5 transition-transform ${expandedRow === item.rank ? 'rotate-180' : ''
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRow === item.rank && (
                                        <tr className="bg-slate-50">
                                            <td colSpan={6} className="px-4 py-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {detailKeys.map((key) => (
                                                        <div key={key} className="bg-white rounded-lg p-3 border border-slate-200">
                                                            <div className="text-xs text-slate-500 mb-1">
                                                                {detailLabels[key] || key}
                                                            </div>
                                                            <div className="font-mono text-sm text-slate-800">
                                                                {formatScore(item[key])}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {item.source && item.source !== 'original' && (
                                                        <div className="col-span-full">
                                                            <div className="text-xs text-slate-500">
                                                                {t.benchmark.source}: {item.source}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}