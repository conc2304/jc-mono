import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('./app.tsx'),
  route('desktop', './routes/desktop.tsx'),
  route('about', './routes/about.tsx'),
  route('boot-loader', './routes/boot-loader.tsx'),
] satisfies RouteConfig;
