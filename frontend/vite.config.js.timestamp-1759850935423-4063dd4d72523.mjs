// vite.config.js
import { defineConfig } from "file:///C:/Users/check/OneDrive/Desktop/SELL%20LMS/LMS-SELL/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/check/OneDrive/Desktop/SELL%20LMS/LMS-SELL/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true
      }
    }
  },
  build: {
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1e3,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // Redux and state management
          "redux-vendor": ["@reduxjs/toolkit", "react-redux"],
          // UI and styling libraries
          "ui-vendor": [
            "framer-motion",
            "react-icons",
            "react-hot-toast",
            "react-rating-stars-component",
            "tailwind-scrollbar"
          ],
          // Chart and visualization libraries
          "chart-vendor": ["chart.js", "react-chartjs-2"],
          // File and document processing
          "document-vendor": [
            "jspdf",
            "jspdf-autotable",
            "html2canvas",
            "file-saver",
            "xlsx"
          ],
          // Code editor and Monaco
          "editor-vendor": ["@monaco-editor/react"],
          // Form and input libraries
          "form-vendor": [
            "react-hook-form",
            "react-otp-input",
            "react-datepicker",
            "react-dropzone"
          ],
          // Media and carousel libraries
          "media-vendor": [
            "video-react",
            "react-owl-carousel",
            "owl.carousel",
            "swiper",
            "react-lazy-load-image-component"
          ],
          // Utility libraries
          "utils-vendor": [
            "axios",
            "socket.io-client",
            "qrcode",
            "copy-to-clipboard",
            "canvas-confetti",
            "jquery"
          ],
          // DnD and interaction libraries
          "interaction-vendor": [
            "@dnd-kit/core",
            "@dnd-kit/modifiers",
            "@dnd-kit/sortable",
            "@dnd-kit/utilities"
          ]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxjaGVja1xcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFNFTEwgTE1TXFxcXExNUy1TRUxMXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxjaGVja1xcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFNFTEwgTE1TXFxcXExNUy1TRUxMXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9jaGVjay9PbmVEcml2ZS9EZXNrdG9wL1NFTEwlMjBMTVMvTE1TLVNFTEwvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMScsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICAvLyBJbmNyZWFzZSBjaHVuayBzaXplIHdhcm5pbmcgbGltaXQgdG8gMTAwMGtiXHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgLy8gVmVuZG9yIGNodW5rIGZvciBSZWFjdCBhbmQgcmVsYXRlZCBsaWJyYXJpZXNcclxuICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIFJlZHV4IGFuZCBzdGF0ZSBtYW5hZ2VtZW50XHJcbiAgICAgICAgICAncmVkdXgtdmVuZG9yJzogWydAcmVkdXhqcy90b29sa2l0JywgJ3JlYWN0LXJlZHV4J10sXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIFVJIGFuZCBzdHlsaW5nIGxpYnJhcmllc1xyXG4gICAgICAgICAgJ3VpLXZlbmRvcic6IFtcclxuICAgICAgICAgICAgJ2ZyYW1lci1tb3Rpb24nLFxyXG4gICAgICAgICAgICAncmVhY3QtaWNvbnMnLFxyXG4gICAgICAgICAgICAncmVhY3QtaG90LXRvYXN0JyxcclxuICAgICAgICAgICAgJ3JlYWN0LXJhdGluZy1zdGFycy1jb21wb25lbnQnLFxyXG4gICAgICAgICAgICAndGFpbHdpbmQtc2Nyb2xsYmFyJ1xyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gQ2hhcnQgYW5kIHZpc3VhbGl6YXRpb24gbGlicmFyaWVzXHJcbiAgICAgICAgICAnY2hhcnQtdmVuZG9yJzogWydjaGFydC5qcycsICdyZWFjdC1jaGFydGpzLTInXSxcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gRmlsZSBhbmQgZG9jdW1lbnQgcHJvY2Vzc2luZ1xyXG4gICAgICAgICAgJ2RvY3VtZW50LXZlbmRvcic6IFtcclxuICAgICAgICAgICAgJ2pzcGRmJyxcclxuICAgICAgICAgICAgJ2pzcGRmLWF1dG90YWJsZScsXHJcbiAgICAgICAgICAgICdodG1sMmNhbnZhcycsXHJcbiAgICAgICAgICAgICdmaWxlLXNhdmVyJyxcclxuICAgICAgICAgICAgJ3hsc3gnXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBDb2RlIGVkaXRvciBhbmQgTW9uYWNvXHJcbiAgICAgICAgICAnZWRpdG9yLXZlbmRvcic6IFsnQG1vbmFjby1lZGl0b3IvcmVhY3QnXSxcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gRm9ybSBhbmQgaW5wdXQgbGlicmFyaWVzXHJcbiAgICAgICAgICAnZm9ybS12ZW5kb3InOiBbXHJcbiAgICAgICAgICAgICdyZWFjdC1ob29rLWZvcm0nLFxyXG4gICAgICAgICAgICAncmVhY3Qtb3RwLWlucHV0JyxcclxuICAgICAgICAgICAgJ3JlYWN0LWRhdGVwaWNrZXInLFxyXG4gICAgICAgICAgICAncmVhY3QtZHJvcHpvbmUnXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBNZWRpYSBhbmQgY2Fyb3VzZWwgbGlicmFyaWVzXHJcbiAgICAgICAgICAnbWVkaWEtdmVuZG9yJzogW1xyXG4gICAgICAgICAgICAndmlkZW8tcmVhY3QnLFxyXG4gICAgICAgICAgICAncmVhY3Qtb3dsLWNhcm91c2VsJyxcclxuICAgICAgICAgICAgJ293bC5jYXJvdXNlbCcsXHJcbiAgICAgICAgICAgICdzd2lwZXInLFxyXG4gICAgICAgICAgICAncmVhY3QtbGF6eS1sb2FkLWltYWdlLWNvbXBvbmVudCdcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIFV0aWxpdHkgbGlicmFyaWVzXHJcbiAgICAgICAgICAndXRpbHMtdmVuZG9yJzogW1xyXG4gICAgICAgICAgICAnYXhpb3MnLFxyXG4gICAgICAgICAgICAnc29ja2V0LmlvLWNsaWVudCcsXHJcbiAgICAgICAgICAgICdxcmNvZGUnLFxyXG4gICAgICAgICAgICAnY29weS10by1jbGlwYm9hcmQnLFxyXG4gICAgICAgICAgICAnY2FudmFzLWNvbmZldHRpJyxcclxuICAgICAgICAgICAgJ2pxdWVyeSdcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIERuRCBhbmQgaW50ZXJhY3Rpb24gbGlicmFyaWVzXHJcbiAgICAgICAgICAnaW50ZXJhY3Rpb24tdmVuZG9yJzogW1xyXG4gICAgICAgICAgICAnQGRuZC1raXQvY29yZScsXHJcbiAgICAgICAgICAgICdAZG5kLWtpdC9tb2RpZmllcnMnLFxyXG4gICAgICAgICAgICAnQGRuZC1raXQvc29ydGFibGUnLFxyXG4gICAgICAgICAgICAnQGRuZC1raXQvdXRpbGl0aWVzJ1xyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrWCxTQUFTLG9CQUFvQjtBQUMvWSxPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVMLHVCQUF1QjtBQUFBLElBQ3ZCLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQTtBQUFBLFVBRVosZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBO0FBQUEsVUFHekQsZ0JBQWdCLENBQUMsb0JBQW9CLGFBQWE7QUFBQTtBQUFBLFVBR2xELGFBQWE7QUFBQSxZQUNYO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQTtBQUFBLFVBR0EsZ0JBQWdCLENBQUMsWUFBWSxpQkFBaUI7QUFBQTtBQUFBLFVBRzlDLG1CQUFtQjtBQUFBLFlBQ2pCO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQTtBQUFBLFVBR0EsaUJBQWlCLENBQUMsc0JBQXNCO0FBQUE7QUFBQSxVQUd4QyxlQUFlO0FBQUEsWUFDYjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQTtBQUFBLFVBR0EsZ0JBQWdCO0FBQUEsWUFDZDtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUE7QUFBQSxVQUdBLGdCQUFnQjtBQUFBLFlBQ2Q7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQTtBQUFBLFVBR0Esc0JBQXNCO0FBQUEsWUFDcEI7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
