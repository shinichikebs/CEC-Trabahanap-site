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
        // host: '127.0.0.1', // Use your local IP address to make Vite accessible on other devices
        host: '127.0.0.1', // Use your local IP address to make Vite accessible on other devices
        port: 5173, // Default port for Vite; you can change it if needed
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000', // Match Laravel's running IP and port
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/sanctum': {
                // target: 'http://127.0.0.1:8000', // For Sanctum CSRF requests
                target: 'http://127.0.0.1:8000', // Match Laravel's running IP and port
                changeOrigin: true,
            },
        },
    },
});