import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default', // SVG'leri varsayılan olarak export eder
        ref: true, // SVG referanslarını kullanabilmek için
        svgo: true, // SVGO optimizasyonunu aktif eder
        titleProp: true, // SVG'ye title prop ekler
      },
      include: '**/*.svg',
    }),
    copy({
      targets: [
        { src: 'src/assets/icons/*.svg', dest: 'dist/assets/icons' } // SVG dosyalarını manuel olarak kopyalar
      ],
      hook: 'writeBundle' // Build tamamlandığında çalıştırılır
    })
  ],
  base: 'http://localhost:5173', // http://localhost:5173
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // `@` alias'ını `./src`'ye yönlendirir
    },
  },
  build: {
    sourcemap: true, // Source map oluşturur
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html') // Ana giriş noktası
      },
      output: {
        assetFileNames: 'assets/[name].[ext]', // Çıkış dosyalarının adlandırma şeması
        chunkFileNames: 'chunks/[name].[hash].js', // JavaScript parçalarının adlandırma şeması
        entryFileNames: 'js/[name].[hash].js', // Giriş dosyalarının adlandırma şeması
      }
    },
    chunkSizeWarningLimit: 1000, // Büyük parçalar için uyarı limiti (kB)
  },
});