'use client';

import { useEffect, useState } from 'react';

interface VisitorCounterProps {
    className?: string;
}

export default function VisitorCounter({ className = '' }: VisitorCounterProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // 动态加载不蒜子脚本
        const script = document.createElement('script');
        script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
        script.async = true;
        document.body.appendChild(script);

        setMounted(true);

        return () => {
            // 清理脚本
            const existingScript = document.querySelector('script[src*="busuanzi"]');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className={`flex items-center gap-3 text-xs ${className}`}>
            {/* 总访客数 */}
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-slate-600">
                    <span id="busuanzi_value_site_uv" className="font-medium">-</span>
                </span>
            </div>
            {/* 总访问量 */}
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-slate-600">
                    <span id="busuanzi_value_site_pv" className="font-medium">-</span>
                </span>
            </div>
        </div>
    );
}
