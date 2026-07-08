import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
  },
  async redirects() {
    return [
      {
        source: "/troca-de-vidro-ipad",
        destination: "/manutencao-ipad",
        permanent: true,
      },
      {
        source: "/troca-de-tela-ipad",
        destination: "/manutencao-ipad",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
