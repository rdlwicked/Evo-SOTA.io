'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function MethodologyPage() {
    // const { t } = useLanguage();

    // const sections = [
    //     {
    //         title: t.methodology.dataSource,
    //         description: t.methodology.dataSourceDesc,
    //         icon: (
    //             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    //             </svg>
    //         ),
    //     },
    //     {
    //         title: t.methodology.rankingRules,
    //         description: t.methodology.rankingRulesDesc,
    //         icon: (
    //             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    //             </svg>
    //         ),
    //     },
    //     {
    //         title: t.methodology.limitations,
    //         description: t.methodology.limitationsDesc,
    //         icon: (
    //             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    //             </svg>
    //         ),
    //     },
    // ];

    // return (
    //     <div className="min-h-screen py-12">
    //         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    //             {/* Header */}
    //             <div className="text-center mb-12">
    //                 <h1 className="text-4xl font-bold text-slate-800 mb-4">
    //                     {t.methodology.title}
    //                 </h1>
    //                 <p className="text-lg text-slate-600">
    //                     {t.methodology.subtitle}
    //                 </p>
    //             </div>

    //             {/* Sections */}
    //             <div className="space-y-8">
    //                 {sections.map((section, index) => (
    //                     <div
    //                         key={index}
    //                         className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
    //                     >
    //                         <div className="flex items-start space-x-4">
    //                             <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
    //                                 {section.icon}
    //                             </div>
    //                             <div>
    //                                 <h2 className="text-xl font-semibold text-slate-800 mb-2">
    //                                     {section.title}
    //                                 </h2>
    //                                 <p className="text-slate-600 leading-relaxed">
    //                                     {section.description}
    //                                 </p>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </div>

    //             {/* Disclaimer */}
    //             <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
    //                 <div className="flex items-start space-x-4">
    //                     <div className="flex-shrink-0">
    //                         <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    //                         </svg>
    //                     </div>
    //                     <div>
    //                         <h3 className="text-lg font-semibold text-amber-800 mb-1">
    //                             {t.methodology.disclaimer}
    //                         </h3>
    //                         <p className="text-amber-700">
    //                             {t.methodology.disclaimerDesc}
    //                         </p>
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* Benchmark Info */}
    //             <div className="mt-12">
    //                 <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
    //                     Supported Benchmarks
    //                 </h2>
    //                 <div className="grid md:grid-cols-3 gap-4">
    //                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    //                         <h3 className="font-semibold text-blue-800">LIBERO</h3>
    //                         <p className="text-sm text-blue-600 mt-1">Average Success Rate (%)</p>
    //                     </div>
    //                     <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
    //                         <h3 className="font-semibold text-emerald-800">CALVIN</h3>
    //                         <p className="text-sm text-emerald-600 mt-1">Average Length (Mainly ABC→D)</p>
    //                     </div>
    //                     <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
    //                         <h3 className="font-semibold text-purple-800">Meta-World</h3>
    //                         <p className="text-sm text-purple-600 mt-1">Average Success Rate (%)</p>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
}