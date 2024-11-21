import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@styles': path.resolve(__dirname, 'resources/css'), // Optional alias for styles
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000', // Ensure this matches Laravel's running port
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/sanctum': {
                target: 'http://127.0.0.1:8000', // For Sanctum CSRF requests
                changeOrigin: true,
            },
        },
    },
});
