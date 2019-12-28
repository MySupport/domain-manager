import Dashboard from './pages/dashboard';
import About from './pages/about';

export default {
  pages: () => [
    {
      label: 'A new dashboard',
      path: '_',
      component: Dashboard,
    },
    {
      label: 'About this project',
      path: '_/about',
      component: About,
    },
    {
      label: 'Domains',
      children: ['Domain'],
    },
    {
      label: 'Reporting',
      children: ['History'],
    },
    {
      label: 'People',
      children: ['User'],
    },
    {
      label: 'Settings',
      children: ['Config'],
    },
  ],
};
