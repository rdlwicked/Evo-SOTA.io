/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    basePath: process.env.NODE_ENV === 'production' ? '/Evo-SOTA.io' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/Evo-SOTA.io/' : '',
}

module.exports = nextConfig
