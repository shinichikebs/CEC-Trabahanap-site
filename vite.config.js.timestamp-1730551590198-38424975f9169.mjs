// vite.config.js
import { defineConfig } from "file:///C:/Users/LENOVO/Documents/CeC-Trabahanap/CeC-Trabahanap-site/node_modules/vite/dist/node/index.js";
import laravel from "file:///C:/Users/LENOVO/Documents/CeC-Trabahanap/CeC-Trabahanap-site/node_modules/laravel-vite-plugin/dist/index.js";
import react from "file:///C:/Users/LENOVO/Documents/CeC-Trabahanap/CeC-Trabahanap-site/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\LENOVO\\Documents\\CeC-Trabahanap\\CeC-Trabahanap-site";
var vite_config_default = defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.jsx"],
      refresh: true
    }),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "resources/js"),
      "@styles": path.resolve(__vite_injected_original_dirname, "resources/css")
      // Optional alias for styles
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        // Ensure this matches Laravel's running port
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      },
      "/sanctum": {
        target: "http://127.0.0.1:8000",
        // For Sanctum CSRF requests
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMRU5PVk9cXFxcRG9jdW1lbnRzXFxcXENlQy1UcmFiYWhhbmFwXFxcXENlQy1UcmFiYWhhbmFwLXNpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXExFTk9WT1xcXFxEb2N1bWVudHNcXFxcQ2VDLVRyYWJhaGFuYXBcXFxcQ2VDLVRyYWJhaGFuYXAtc2l0ZVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvTEVOT1ZPL0RvY3VtZW50cy9DZUMtVHJhYmFoYW5hcC9DZUMtVHJhYmFoYW5hcC1zaXRlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgbGFyYXZlbCBmcm9tICdsYXJhdmVsLXZpdGUtcGx1Z2luJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIGxhcmF2ZWwoe1xuICAgICAgICAgICAgaW5wdXQ6IFsncmVzb3VyY2VzL2Nzcy9hcHAuY3NzJywgJ3Jlc291cmNlcy9qcy9hcHAuanN4J10sXG4gICAgICAgICAgICByZWZyZXNoOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICAgcmVhY3QoKSxcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3Jlc291cmNlcy9qcycpLFxuICAgICAgICAgICAgJ0BzdHlsZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncmVzb3VyY2VzL2NzcycpLCAvLyBPcHRpb25hbCBhbGlhcyBmb3Igc3R5bGVzXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgcHJveHk6IHtcbiAgICAgICAgICAgICcvYXBpJzoge1xuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwMCcsIC8vIEVuc3VyZSB0aGlzIG1hdGNoZXMgTGFyYXZlbCdzIHJ1bm5pbmcgcG9ydFxuICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICcvc2FuY3R1bSc6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAnLCAvLyBGb3IgU2FuY3R1bSBDU1JGIHJlcXVlc3RzXG4gICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtYLFNBQVMsb0JBQW9CO0FBQy9ZLE9BQU8sYUFBYTtBQUNwQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNKLE9BQU8sQ0FBQyx5QkFBeUIsc0JBQXNCO0FBQUEsTUFDdkQsU0FBUztBQUFBLElBQ2IsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUMzQyxXQUFXLEtBQUssUUFBUSxrQ0FBVyxlQUFlO0FBQUE7QUFBQSxJQUN0RDtBQUFBLEVBQ0o7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLE9BQU87QUFBQSxNQUNILFFBQVE7QUFBQSxRQUNKLFFBQVE7QUFBQTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsTUFDaEQ7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNSLFFBQVE7QUFBQTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2xCO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
