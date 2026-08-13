import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { Buffer } from 'buffer';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  const wpUser = process.env.VITE_WP_REST_USER;
  const wpPassword = process.env.VITE_WP_REST_PASSWORD;
  const authHeader = wpUser && wpPassword
    ? 'Basic ' + Buffer.from(`${wpUser}:${wpPassword}`).toString('base64')
    : null;

  return defineConfig({
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/wp-json': {
          target: 'https://thelondonhub.co.uk/florencedolls',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/wp-json/, '/wp-json'),
          configure(proxy) {
            if (!authHeader) return;
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', authHeader);
            });
          },
        },
        '/wp-comments-post.php': {
          target: 'https://thelondonhub.co.uk/florencedolls',
          changeOrigin: true,
        },
      },
    },
  });
};
