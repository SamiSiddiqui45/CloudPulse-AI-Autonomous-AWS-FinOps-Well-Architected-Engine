import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { scanLiveAwsEnvironment, listAwsProfiles, saveAwsProfile } from './src/server/awsScanner.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'live-aws-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const parsedUrl = new URL(req.url, 'http://localhost');
          
          if (parsedUrl.pathname === '/api/aws/live-status') {
            try {
              const rawProfile = parsedUrl.searchParams.get('profile');
              const profile = (rawProfile && rawProfile !== '[object Object]') ? rawProfile : undefined;
              const data = scanLiveAwsEnvironment(profile);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          if (parsedUrl.pathname === '/api/aws/profiles') {
            try {
              const profiles = listAwsProfiles();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ profiles }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          if (parsedUrl.pathname === '/api/aws/save-profile' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { profileName, accessKeyId, secretAccessKey, region } = JSON.parse(body);
                const result = saveAwsProfile(profileName, accessKeyId, secretAccessKey, region);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
              } catch (err) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
            return;
          }

          next();
        });
      }
    }
  ],
})

