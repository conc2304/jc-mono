import { type RouteConfig, index, route } from '@react-router/dev/routes';
import { lazy } from 'react';

export default [
  index('./app.tsx'),
  route('home', './routes/desktop.tsx'),
  route('*', './routes/404.tsx'),
] satisfies RouteConfig;
