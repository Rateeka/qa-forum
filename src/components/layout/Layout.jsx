// src/components/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <Sidebar />
      </aside>
    </div>
  </div>
);

export default Layout;
