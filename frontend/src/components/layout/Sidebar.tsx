import { LayoutDashboard, Users, X, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { SidebarProps } from '../../types';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
];

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen bg-card border-r transform transition-all duration-300 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {isCollapsed ? (
            <div className="flex items-center justify-center w-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Layers className="h-6 w-6" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">User Management System</p>
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-accent rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 pt-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent',
                  isCollapsed ? 'justify-center' : ''
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={onToggleCollapse}
          className={cn(
            'hidden lg:flex absolute -right-3 top-10 h-6 w-6 items-center justify-center',
            'rounded-full border bg-background shadow-md hover:bg-accent transition-colors',
            'z-50'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </aside>
    </>
  );
}
