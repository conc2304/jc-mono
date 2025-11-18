import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('./app.tsx'),
  route('home', './routes/home.tsx'),
  route('led-controller', './routes/led-controller.tsx'),
  route('*', './routes/404.tsx'),
] satisfies RouteConfig;
