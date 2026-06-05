import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {compression} from 'vite-plugin-compression2';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      // Gera arquivos estáticos pré-comprimidos Gzip
      compression({
        algorithms: ['gzip'] as const,
        threshold: 1400, // Comprime arquivos maiores de ~1.4KB
        exclude: [/\.(map)$/i],
      }),
      // Gera arquivos estáticos pré-comprimidos Brotli para suporte nativo em navegadores modernos
      compression({
        algorithms: ['brotliCompress'] as const,
        threshold: 1400,
        exclude: [/\.(map)$/i],
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      // Divide assets de forma limpa e otimiza cache caching
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // React núcleo e renderizador
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'vendor-react-core';
              }
              // Firebase Auth e Firestore SDKs
              if (id.includes('@firebase') || id.includes('firebase')) {
                return 'vendor-firebase';
              }
              // Supabase Client SDK
              if (id.includes('supabase-js') || id.includes('@supabase')) {
                return 'vendor-supabase';
              }
              // Mapas Leaflet e suas integrações
              if (id.includes('leaflet') || id.includes('react-leaflet')) {
                return 'vendor-leaflet';
              }
              // Componentes de gráficos e manipuladores matemáticos (Recharts + D3)
              if (id.includes('recharts') || id.includes('d3')) {
                return 'vendor-charts';
              }
              // Biblioteca de animações (motion & framer-motion)
              if (id.includes('motion') || id.includes('framer-motion')) {
                return 'vendor-animations';
              }
              // Pacote visual de Ícones Lucide
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              // Renderização de conteúdo markdown e parseamento
              if (id.includes('react-markdown') || id.includes('vfile') || id.includes('unist') || id.includes('micromark')) {
                return 'vendor-markdown';
              }
              // Integrações de pagamentos Stripe
              if (id.includes('stripe') || id.includes('@stripe')) {
                return 'vendor-stripe';
              }
              // GenAI e outros sdk agregados
              if (id.includes('@google/genai')) {
                return 'vendor-genai';
              }
              // Outros agrupamentos de utilitários de terceiros
              return 'vendor-utils';
            }
          }
        }
      },
      chunkSizeWarningLimit: 1000 // Aumenta limite de alerta de chunk após o smart split
    }
  };
});
