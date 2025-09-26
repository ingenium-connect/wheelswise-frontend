import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wheelwise-files.s3.amazonaws.com",
        pathname: "**"
      }
    ]
  }
}

export default nextConfig