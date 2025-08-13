import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('./app.tsx'),
  route('desktop', './routes/desktop.tsx'),
  route('about', './routes/about.tsx'),
  route('*', './routes/404.tsx'),
] satisfies RouteConfig;
