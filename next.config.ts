import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
  
//     /* Copied from https://huggingface.co/docs/transformers.js/en/tutorials/next */
//     // output: 'export', // Feel free to modify/remove this option
//     // // Override the default webpack configuration
//     // webpack: (config) => {
//     //   // See https://webpack.js.org/configuration/resolve/#resolvealias
//     //   config.resolve.alias = {
//     //     ...config.resolve.alias,
//     //     "sharp$": false,
//     //     "onnxruntime-node$": false,
//     //   }
//     //   return config;
//     // },  
//     /* Copied from https://huggingface.co/docs/transformers.js/en/tutorials/next */
//     serverExternalPackages: ["sharp", "onnxruntime-node"],
// };
const nextConfig:NextConfig = {
  serverExternalPackages: ["sharp", "onnxruntime-node"],
};


export default nextConfig;
