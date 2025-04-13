import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { TermsOfServicePage } from './pages/TermsOfService.page';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/terms', element: <TermsOfServicePage /> },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
