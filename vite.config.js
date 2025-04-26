import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
    // Load env variables
    const env = loadEnv(mode, process.cwd(), '');
    
    // Check if we're in production mode
    const isProduction = mode === 'production' || env.APP_ENV === 'production';
    
    // Base configuration shared between environments
    const config = {
        // Define base as empty string to generate relative URLs
        base: '',
        plugins: [
            laravel({
                input: 'resources/js/app.tsx',
                refresh: true,
            }),
            react(),
        ],
    };
    
    // Environment-specific configurations
    if (isProduction) {
        // Production Configuration
        return {
            ...config,
            server: {
                https: false,
                host: '0.0.0.0',
                hmr: {
                    host: 'dash.berp.app.br',
                    protocol: 'ws'
                }
            },
            watch: {
                usePolling: true,
            }
        };
    } else {
        // Development Configuration
        return {
            ...config,
            server: {
                hmr: {
                    host: '127.0.0.1',
                }
            },
            watch: {
                usePolling: true,
                origin: 'http://127.0.0.1'
            }
        };
    }
});