
import type {NextConfig} from 'next';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) { // Only for client-side production builds
      // This helps ensure Monaco's assets are available.
      // A simpler approach is to manually copy monaco-editor/min/vs to public/monaco-editor/vs
      // and adjust loader.config in SqlEditor.tsx if necessary.
      // For this exercise, we assume files are manually placed in public/monaco-editor/vs
      // or handled by a postinstall script.
      // config.plugins.push(
      //   new CopyWebpackPlugin({
      //     patterns: [
      //       {
      //         from: path.join(__dirname, 'node_modules/monaco-editor/min/vs'),
      //         to: path.join(__dirname, 'public/monaco-editor/vs'),
      //       },
      //     ],
      //   })
      // );
    }
    // Handle Monaco worker loading for production
    // This is complex and often requires specific configurations based on deployment.
    // For now, relying on the loader.config and manual public folder setup.
    return config;
  },
};

export default nextConfig;
