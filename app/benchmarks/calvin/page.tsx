'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

interface CalvinModel {
    name: string;
    paper_url: string;
    pub_date: string;
    inst1: number | null;
    inst2: number | null;
    inst3: number | null;
    inst4: number | null;
    inst5: number | null;
    avg_len: number | null;
    source: string;
    rank: number;
}

interface CalvinData {
    abc_d: CalvinModel[];
    abcd_d: CalvinModel[];
    d_d: CalvinModel[];
}

type CalvinSetting = 'abc_d' | 'abcd_d' | 'd_d';

export default function CalvinPage() {
    const { locale } = useLanguage();
    const [data, setData] = useState<CalvinData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSetting, setActiveSetting] = useState<CalvinSetting>('abc_d');
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [showAllMetrics, setShowAllMetrics] = useState(false);
    const [sortBy, setSortBy] = useState<'rank' | 'avg_len' | 'date'>('rank');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const texts = {
        en: {
            title: 'CALVIN Benchmark Leaderboard',
            description: 'CALVIN (Composing Actions from Language and Vision) is a benchmark for learning long-horizon language-conditioned tasks.',
            models: 'models',
            showAllMetrics: 'Show All Metrics',
            hideMetrics: 'Compact View',
            rank: 'Rank',
            model: 'Model',
            date: 'Date',
            paper: 'Paper',
            clickToExpand: 'Click row to expand details',
            metrics: 'Task completion rate (1-5 consecutive tasks)',
            setting: 'Setting',
            settingDesc: {
                abc_d: 'ABC→D: Train on environments A,B,C; Test on D (Main)',
                abcd_d: 'ABCD→D: Train on all environments; Test on D',
                d_d: 'D→D: Train and test on environment D',
            }
        },
        zh: {
            title: 'CALVIN 基准测试榜单',
            description: 'CALVIN（组合语言和视觉的动作）是一个用于学习长周期语言条件任务的基准测试。',
            models: '个模型',
            showAllMetrics: '展开所有指标',
            hideMetrics: '紧凑视图',
            rank: '排名',
            model: '模型',
            date: '日期',
            paper: '论文',
            clickToExpand: '点击行展开详情',
            metrics: '任务完成率（1-5 连续任务）',
            setting: '设置',
            settingDesc: {
                abc_d: 'ABC→D: 在环境 A,B,C 训练；在 D 测试（主榜单）',
                abcd_d: 'ABCD→D: 在所有环境训练；在 D 测试',
                d_d: 'D→D: 在环境 D 训练和测试',
            }
        }
    };

    const t = texts[locale];

    const settingLabels: Record<CalvinSetting, string> = {
        abc_d: 'ABC→D',
        abcd_d: 'ABCD→D',
        d_d: 'D→D',
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const basePath = process.env.NODE_ENV === 'production' ? '/Evo-SOTA.io' : '';
                const res = await fetch(`${basePath}/data/calvin.json`);
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const toggleRow = (rank: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(rank)) {
            newExpanded.delete(rank);
        } else {
            newExpanded.add(rank);
        }
        setExpandedRows(newExpanded);
    };

    const handleSort = (key: 'rank' | 'avg_len' | 'date') => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder(key === 'rank' ? 'asc' : 'desc');
        }
    };

    const currentData = data ? data[activeSetting] : [];

    const sortedData = [...currentData].sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'rank') {
            comparison = a.rank - b.rank;
        } else if (sortBy === 'avg_len') {
            comparison = (b.avg_len || 0) - (a.avg_len || 0);
        } else if (sortBy === 'date') {
            comparison = b.pub_date.localeCompare(a.pub_date);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const formatValue = (value: number | null, decimals: number = 2): string => {
        if (value === null) return '-';
        return value.toFixed(decimals);
    };

    const formatPercent = (value: number | null): string => {
        if (value === null) return '-';
        return (value * 100).toFixed(1) + '%';
    };

    const getRankStyle = (rank: number) => {
        if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        if (rank === 2) return 'bg-gray-100 text-gray-700 border-gray-300';
        if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-300';
        return 'bg-slate-50 text-slate-600 border-slate-200';
    };

    // 切换设置时重置展开状态
    const handleSettingChange = (setting: CalvinSetting) => {
        setActiveSetting(setting);
        setExpandedRows(new Set());
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-10 bg-slate-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-slate-200 rounded w-2/3 mb-8"></div>
                        <div className="h-96 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-emerald-200 text-sm mb-4">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <span>CALVIN</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.title}</h1>
                    <p className="text-emerald-100 max-w-3xl">{t.description}</p>
                    <div className="mt-4 flex items-center gap-4">
                        <span className="px-3 py-1 bg-emerald-500 rounded-full text-sm">
                            {currentData.length} {t.models}
                        </span>
                        <span className="px-3 py-1 bg-emerald-500/50 rounded-full text-sm">
                            {settingLabels[activeSetting]}
                        </span>
                    </div>
                </div>
            </div>

            {/* Setting Selector */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">{t.setting}</h3>
                    <div className="flex flex-wrap gap-3">
                        {(Object.keys(settingLabels) as CalvinSetting[]).map((setting) => (
                            <button
                                key={setting}
                                onClick={() => handleSettingChange(setting)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${activeSetting === setting
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    } ${setting === 'abc_d' ? 'ring-2 ring-emerald-300 ring-offset-1' : ''}`}
                            >
                                {settingLabels[setting]}
                                {setting === 'abc_d' && (
                                    <span className="ml-2 text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded">Main</span>
                                )}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        {t.settingDesc[activeSetting]}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowAllMetrics(!showAllMetrics)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${showAllMetrics
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50'
                                }`}
                        >
                            {showAllMetrics ? t.hideMetrics : t.showAllMetrics}
                        </button>
                    </div>
                    <p className="text-sm text-slate-500">{t.clickToExpand}</p>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th
                                        className="px-4 py-3 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                                        onClick={() => handleSort('rank')}
                                    >
                                        <div className="flex items-center gap-1">
                                            {t.rank}
                                            {sortBy === 'rank' && (
                                                <span className="text-emerald-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        {t.model}
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                                        onClick={() => handleSort('avg_len')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Avg. Len
                                            {sortBy === 'avg_len' && (
                                                <span className="text-emerald-600">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                                            )}
                                        </div>
                                    </th>
                                    {showAllMetrics && (
                                        <>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">1 Task</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">2 Tasks</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">3 Tasks</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">4 Tasks</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">5 Tasks</th>
                                        </>
                                    )}
                                    <th
                                        className="px-4 py-3 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                                        onClick={() => handleSort('date')}
                                    >
                                        <div className="flex items-center gap-1">
                                            {t.date}
                                            {sortBy === 'date' && (
                                                <span className="text-emerald-600">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t.paper}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((model) => (
                                    <>
                                        <tr
                                            key={model.rank}
                                            className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${expandedRows.has(model.rank) ? 'bg-emerald-50' : ''
                                                }`}
                                            onClick={() => toggleRow(model.rank)}
                                        >
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${getRankStyle(model.rank)}`}>
                                                    {model.rank}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-800">{model.name}</div>
                                                <div className="text-xs text-slate-500">{model.source}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-lg font-semibold text-emerald-600">
                                                    {formatValue(model.avg_len)}
                                                </span>
                                            </td>
                                            {showAllMetrics && (
                                                <>
                                                    <td className="px-4 py-3 font-mono text-slate-600">{formatPercent(model.inst1)}</td>
                                                    <td className="px-4 py-3 font-mono text-slate-600">{formatPercent(model.inst2)}</td>
                                                    <td className="px-4 py-3 font-mono text-slate-600">{formatPercent(model.inst3)}</td>
                                                    <td className="px-4 py-3 font-mono text-slate-600">{formatPercent(model.inst4)}</td>
                                                    <td className="px-4 py-3 font-mono text-slate-600">{formatPercent(model.inst5)}</td>
                                                </>
                                            )}
                                            <td className="px-4 py-3 text-slate-600 text-sm">{model.pub_date}</td>
                                            <td className="px-4 py-3">
                                                {model.paper_url && (
                                                    <a
                                                        href={model.paper_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-emerald-600 hover:text-emerald-800 hover:underline text-sm"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        📄 Link
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                        {/* Expanded Details Row */}
                                        {expandedRows.has(model.rank) && !showAllMetrics && (
                                            <tr key={`${model.rank}-expanded`} className="bg-emerald-50 border-b border-slate-200">
                                                <td colSpan={5} className="px-4 py-4">
                                                    <div className="ml-12">
                                                        <h4 className="text-sm font-semibold text-slate-700 mb-3">{t.metrics}</h4>
                                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                                <div className="text-xs text-slate-500 mb-1">1 Task</div>
                                                                <div className="font-mono text-lg font-semibold text-slate-800">
                                                                    {formatPercent(model.inst1)}
                                                                </div>
                                                            </div>
                                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                                <div className="text-xs text-slate-500 mb-1">2 Tasks</div>
                                                                <div className="font-mono text-lg font-semibold text-slate-800">
                                                                    {formatPercent(model.inst2)}
                                                                </div>
                                                            </div>
                                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                                <div className="text-xs text-slate-500 mb-1">3 Tasks</div>
                                                                <div className="font-mono text-lg font-semibold text-slate-800">
                                                                    {formatPercent(model.inst3)}
                                                                </div>
                                                            </div>
                                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                                <div className="text-xs text-slate-500 mb-1">4 Tasks</div>
                                                                <div className="font-mono text-lg font-semibold text-slate-800">
                                                                    {formatPercent(model.inst4)}
                                                                </div>
                                                            </div>
                                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                                <div className="text-xs text-slate-500 mb-1">5 Tasks</div>
                                                                <div className="font-mono text-lg font-semibold text-slate-800">
                                                                    {formatPercent(model.inst5)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Metrics Description</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                        <div><span className="font-medium">Avg. Len:</span> Average number of consecutive tasks completed (0-5)</div>
                        <div><span className="font-medium">1-5 Tasks:</span> Success rate of completing N consecutive tasks</div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Settings Explanation</h4>
                        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
                            <div><span className="font-medium text-emerald-600">ABC→D:</span> Zero-shot generalization</div>
                            <div><span className="font-medium">ABCD→D:</span> Full training data</div>
                            <div><span className="font-medium">D→D:</span> Same environment</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}