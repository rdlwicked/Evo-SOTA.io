/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    // 使用自定义域名后不需要 basePath 和 assetPrefix
    basePath: '',
    assetPrefix: '',
}

module.exports = nextConfig
