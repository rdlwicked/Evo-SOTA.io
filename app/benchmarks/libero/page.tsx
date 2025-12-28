'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

interface LiberoModel {
    name: string;
    paper_url: string;
    pub_date: string;
    spatial: number | null;
    object: number | null;
    goal: number | null;
    long: number | null;
    libero_90: number | null;
    average: number | null;
    source: string;
    rank: number;
}

export default function LiberoPage() {
    // const { locale } = useLanguage();
    // const [data, setData] = useState<LiberoModel[]>([]);
    // const [loading, setLoading] = useState(true);
    // const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    // const [showAllMetrics, setShowAllMetrics] = useState(false);
    // const [sortBy, setSortBy] = useState<'rank' | 'average' | 'date'>('rank');
    // const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // const texts = {
    //     en: {
    //         title: 'LIBERO Benchmark Leaderboard',
    //         description: 'LIBERO is a benchmark suite for lifelong robot learning, consisting of 130 language-conditioned manipulation tasks across 4 task suites.',
    //         models: 'models',
    //         showAllMetrics: 'Show All Metrics',
    //         hideMetrics: 'Compact View',
    //         rank: 'Rank',
    //         model: 'Model',
    //         date: 'Date',
    //         paper: 'Paper',
    //         clickToExpand: 'Click row to expand details',
    //         metrics: 'Sub-metrics',
    //     },
    //     zh: {
    //         title: 'LIBERO 基准测试榜单',
    //         description: 'LIBERO 是一个终身机器人学习基准测试套件，包含 4 个任务套件中的 130 个语言条件操作任务。',
    //         models: '个模型',
    //         showAllMetrics: '展开所有指标',
    //         hideMetrics: '紧凑视图',
    //         rank: '排名',
    //         model: '模型',
    //         date: '日期',
    //         paper: '论文',
    //         clickToExpand: '点击行展开详情',
    //         metrics: '分项指标',
    //     }
    // };

    // const t = texts[locale];

    // useEffect(() => {
    //     const loadData = async () => {
    //         try {
    //             const basePath = process.env.NODE_ENV === 'production' ? '/Evo-SOTA.io' : '';
    //             const res = await fetch(`${basePath}/data/libero.json`);
    //             const json = await res.json();
    //             setData(json);
    //         } catch (error) {
    //             console.error('Error loading data:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     loadData();
    // }, []);

    // const toggleRow = (rank: number) => {
    //     const newExpanded = new Set(expandedRows);
    //     if (newExpanded.has(rank)) {
    //         newExpanded.delete(rank);
    //     } else {
    //         newExpanded.add(rank);
    //     }
    //     setExpandedRows(newExpanded);
    // };

    // const handleSort = (key: 'rank' | 'average' | 'date') => {
    //     if (sortBy === key) {
    //         setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    //     } else {
    //         setSortBy(key);
    //         setSortOrder(key === 'rank' ? 'asc' : 'desc');
    //     }
    // };

    // const sortedData = [...data].sort((a, b) => {
    //     let comparison = 0;
    //     if (sortBy === 'rank') {
    //         comparison = a.rank - b.rank;
    //     } else if (sortBy === 'average') {
    //         comparison = (b.average || 0) - (a.average || 0);
    //     } else if (sortBy === 'date') {
    //         comparison = b.pub_date.localeCompare(a.pub_date);
    //     }
    //     return sortOrder === 'asc' ? comparison : -comparison;
    // });

    // const formatValue = (value: number | null): string => {
    //     if (value === null) return '-';
    //     return value.toFixed(1);
    // };

    // const getRankStyle = (rank: number) => {
    //     if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    //     if (rank === 2) return 'bg-gray-100 text-gray-700 border-gray-300';
    //     if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-300';
    //     return 'bg-slate-50 text-slate-600 border-slate-200';
    // };

    // if (loading) {
    //     return (
    //         <div className="min-h-screen bg-slate-50 py-8 px-4">
    //             <div className="max-w-7xl mx-auto">
    //                 <div className="animate-pulse">
    //                     <div className="h-10 bg-slate-200 rounded w-1/3 mb-4"></div>
    //                     <div className="h-4 bg-slate-200 rounded w-2/3 mb-8"></div>
    //                     <div className="h-96 bg-slate-200 rounded"></div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    // return (
    //     <div className="min-h-screen bg-slate-50">
    //         {/* Header */}
    //         <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-4">
    //             <div className="max-w-7xl mx-auto">
    //                 <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
    //                     <Link href="/" className="hover:text-white transition-colors">Home</Link>
    //                     <span>/</span>
    //                     <span>LIBERO</span>
    //                 </div>
    //                 <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.title}</h1>
    //                 <p className="text-blue-100 max-w-3xl">{t.description}</p>
    //                 <div className="mt-4 flex items-center gap-4">
    //                     <span className="px-3 py-1 bg-blue-500 rounded-full text-sm">
    //                         {data.length} {t.models}
    //                     </span>
    //                 </div>
    //             </div>
    //         </div>

    //         {/* Controls */}
    //         <div className="max-w-7xl mx-auto px-4 py-6">
    //             <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
    //                 <div className="flex items-center gap-4">
    //                     <button
    //                         onClick={() => setShowAllMetrics(!showAllMetrics)}
    //                         className={`px-4 py-2 rounded-lg font-medium transition-all ${showAllMetrics
    //                             ? 'bg-blue-600 text-white'
    //                             : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
    //                             }`}
    //                     >
    //                         {showAllMetrics ? t.hideMetrics : t.showAllMetrics}
    //                     </button>
    //                 </div>
    //                 <p className="text-sm text-slate-500">{t.clickToExpand}</p>
    //             </div>

    //             {/* Table */}
    //             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    //                 <div className="overflow-x-auto">
    //                     <table className="w-full">
    //                         <thead>
    //                             <tr className="bg-slate-50 border-b border-slate-200">
    //                                 <th
    //                                     className="px-4 py-3 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
    //                                     onClick={() => handleSort('rank')}
    //                                 >
    //                                     <div className="flex items-center gap-1">
    //                                         {t.rank}
    //                                         {sortBy === 'rank' && (
    //                                             <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
    //                                         )}
    //                                     </div>
    //                                 </th>
    //                                 <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
    //                                     {t.model}
    //                                 </th>
    //                                 <th
    //                                     className="px-4 py-3 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
    //                                     onClick={() => handleSort('average')}
    //                                 >
    //                                     <div className="flex items-center gap-1">
    //                                         Average
    //                                         {sortBy === 'average' && (
    //                                             <span className="text-blue-600">{sortOrder === 'desc' ? '↓' : '↑'}</span>
    //                                         )}
    //                                     </div>
    //                                 </th>
    //                                 {showAllMetrics && (
    //                                     <>
    //                                         <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Spatial</th>
    //                                         <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Object</th>
    //                                         <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Goal</th>
    //                                         <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Long</th>
    //                                         <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">LIBERO-90</th>
    //                                     </>
    //                                 )}
    //                                 <th
    //                                     className="px-4 py-3 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
    //                                     onClick={() => handleSort('date')}
    //                                 >
    //                                     <div className="flex items-center gap-1">
    //                                         {t.date}
    //                                         {sortBy === 'date' && (
    //                                             <span className="text-blue-600">{sortOrder === 'desc' ? '↓' : '↑'}</span>
    //                                         )}
    //                                     </div>
    //                                 </th>
    //                                 <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.paper}</th>
    //                             </tr>
    //                         </thead>
    //                         <tbody>
    //                             {sortedData.map((model) => (
    //                                 <>
    //                                     <tr
    //                                         key={model.rank}
    //                                         className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${expandedRows.has(model.rank) ? 'bg-blue-50' : ''
    //                                             }`}
    //                                         onClick={() => toggleRow(model.rank)}
    //                                     >
    //                                         <td className="px-4 py-3">
    //                                             <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${getRankStyle(model.rank)}`}>
    //                                                 {model.rank}
    //                                             </span>
    //                                         </td>
    //                                         <td className="px-4 py-3">
    //                                             <div className="font-medium text-slate-800">{model.name}</div>
    //                                             <div className="text-xs text-slate-500">{model.source}</div>
    //                                         </td>
    //                                         <td className="px-4 py-3">
    //                                             <span className="font-mono text-lg font-semibold text-blue-600">
    //                                                 {formatValue(model.average)}
    //                                             </span>
    //                                         </td>
    //                                         {showAllMetrics && (
    //                                             <>
    //                                                 <td className="px-4 py-3 font-mono text-slate-600">{formatValue(model.spatial)}</td>
    //                                                 <td className="px-4 py-3 font-mono text-slate-600">{formatValue(model.object)}</td>
    //                                                 <td className="px-4 py-3 font-mono text-slate-600">{formatValue(model.goal)}</td>
    //                                                 <td className="px-4 py-3 font-mono text-slate-600">{formatValue(model.long)}</td>
    //                                                 <td className="px-4 py-3 font-mono text-slate-600">{formatValue(model.libero_90)}</td>
    //                                             </>
    //                                         )}
    //                                         <td className="px-4 py-3 text-slate-600 text-sm">{model.pub_date}</td>
    //                                         <td className="px-4 py-3">
    //                                             {model.paper_url && (
    //                                                 <a
    //                                                     href={model.paper_url}
    //                                                     target="_blank"
    //                                                     rel="noopener noreferrer"
    //                                                     className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
    //                                                     onClick={(e) => e.stopPropagation()}
    //                                                 >
    //                                                     📄 Link
    //                                                 </a>
    //                                             )}
    //                                         </td>
    //                                     </tr>
    //                                     {/* Expanded Details Row */}
    //                                     {expandedRows.has(model.rank) && !showAllMetrics && (
    //                                         <tr key={`${model.rank}-expanded`} className="bg-blue-50 border-b border-slate-200">
    //                                             <td colSpan={5} className="px-4 py-4">
    //                                                 <div className="ml-12">
    //                                                     <h4 className="text-sm font-semibold text-slate-700 mb-3">{t.metrics}</h4>
    //                                                     <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    //                                                         <div className="bg-white rounded-lg p-3 shadow-sm">
    //                                                             <div className="text-xs text-slate-500 mb-1">Spatial</div>
    //                                                             <div className="font-mono text-lg font-semibold text-slate-800">
    //                                                                 {formatValue(model.spatial)}
    //                                                             </div>
    //                                                         </div>
    //                                                         <div className="bg-white rounded-lg p-3 shadow-sm">
    //                                                             <div className="text-xs text-slate-500 mb-1">Object</div>
    //                                                             <div className="font-mono text-lg font-semibold text-slate-800">
    //                                                                 {formatValue(model.object)}
    //                                                             </div>
    //                                                         </div>
    //                                                         <div className="bg-white rounded-lg p-3 shadow-sm">
    //                                                             <div className="text-xs text-slate-500 mb-1">Goal</div>
    //                                                             <div className="font-mono text-lg font-semibold text-slate-800">
    //                                                                 {formatValue(model.goal)}
    //                                                             </div>
    //                                                         </div>
    //                                                         <div className="bg-white rounded-lg p-3 shadow-sm">
    //                                                             <div className="text-xs text-slate-500 mb-1">Long</div>
    //                                                             <div className="font-mono text-lg font-semibold text-slate-800">
    //                                                                 {formatValue(model.long)}
    //                                                             </div>
    //                                                         </div>
    //                                                         <div className="bg-white rounded-lg p-3 shadow-sm">
    //                                                             <div className="text-xs text-slate-500 mb-1">LIBERO-90</div>
    //                                                             <div className="font-mono text-lg font-semibold text-slate-800">
    //                                                                 {formatValue(model.libero_90)}
    //                                                             </div>
    //                                                         </div>
    //                                                     </div>
    //                                                 </div>
    //                                             </td>
    //                                         </tr>
    //                                     )}
    //                                 </>
    //                             ))}
    //                         </tbody>
    //                     </table>
    //                 </div>
    //             </div>

    //             {/* Legend */}
    //             <div className="mt-6 p-4 bg-white rounded-lg border border-slate-200">
    //                 <h3 className="text-sm font-semibold text-slate-700 mb-2">Metrics Description</h3>
    //                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-600">
    //                     <div><span className="font-medium">Spatial:</span> LIBERO-Spatial task suite</div>
    //                     <div><span className="font-medium">Object:</span> LIBERO-Object task suite</div>
    //                     <div><span className="font-medium">Goal:</span> LIBERO-Goal task suite</div>
    //                     <div><span className="font-medium">Long:</span> LIBERO-Long task suite</div>
    //                     <div><span className="font-medium">LIBERO-90:</span> 90 tasks benchmark</div>
    //                     <div><span className="font-medium">Average:</span> Mean success rate across suites</div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
}