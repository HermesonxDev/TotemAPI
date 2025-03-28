import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    watch: {
        usePolling: true,
        origin: 'http://127.0.0.1'
    },
    server: {
        hmr: {
            host: '127.0.0.1'
        }
    }
});
