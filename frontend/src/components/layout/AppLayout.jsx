// AppLayout: the frame of every logged-in page (sidebar + topbar + page content)
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import NewVersionPopup from '../ui/NewVersionPopup.jsx';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <NewVersionPopup />
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
