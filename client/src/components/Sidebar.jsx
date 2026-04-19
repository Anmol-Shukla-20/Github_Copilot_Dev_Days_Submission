import { Link, NavLink } from "react-router-dom";
import { Calendar, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/settings", label: "Settings", icon: Settings }
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white p-4 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <Link to="/" className="mb-8 block text-2xl font-black tracking-tight text-slate-900">
        Smart Assignment Tracker
      </Link>

      <div className="mb-6 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
        <img src={user?.picture} alt={user?.name} className="h-10 w-10 rounded-full" />
        <div>
          <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-amber-100 text-amber-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
