import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const icons = {
        dashboard: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
        seller: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
        profile: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        logout: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        )
    };

    const NavItem = ({ href, active, icon, children, collapsed }) => (
        <Link
            href={href}
            className={`flex items-center py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                collapsed ? 'justify-center px-2' : 'px-4'
            } ${
                active
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
            title={collapsed ? children : undefined}
        >
            {icon && <span className={`flex-shrink-0 ${collapsed ? '' : 'mr-3'}`}>{icon}</span>}
            {!collapsed && <span className="truncate">{children}</span>}
        </Link>
    );

    const SidebarContent = ({ collapsed }) => (
        <>
            <div className={`flex h-20 shrink-0 items-center border-b border-gray-100 ${collapsed ? 'justify-center px-2' : 'px-6'}`}>
                <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105" title={collapsed ? "App Home" : undefined}>
                    <ApplicationLogo className={`block w-auto fill-current text-indigo-600 transition-all duration-300 ${collapsed ? 'h-8' : 'h-10'}`} />
                </Link>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto bg-white overflow-x-hidden">
                <nav className="flex-1 space-y-2 px-3 py-6">
                    {user.role === 'admin' && (
                        <NavItem href={route('admin.index')} active={route().current('admin.index')} icon={icons.dashboard} collapsed={collapsed}>
                            Dashboard
                        </NavItem>
                    )}
                    {user.role === 'seller' && (
                        <NavItem href={route('dashboard')} active={route().current('dashboard')} icon={icons.dashboard} collapsed={collapsed}>
                            Dashboard
                        </NavItem>
                    )}
                    {user.role === 'user' && (
                        <>
                            <NavItem href={route('dashboard')} active={route().current('dashboard')} icon={icons.dashboard} collapsed={collapsed}>
                                Dashboard
                            </NavItem>
                            <NavItem href={route('seller.create')} active={route().current('seller.create')} icon={icons.seller} collapsed={collapsed}>
                                Become a Seller
                            </NavItem>
                        </>
                    )}
                </nav>
                <div className={`border-t border-gray-100 p-3 bg-gray-50/50 transition-all ${collapsed ? 'items-center' : ''}`}>
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'px-2'}`}>
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shadow-sm" title={collapsed ? user.name : undefined}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        {!collapsed && (
                            <div className="ml-3 truncate">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs font-medium text-gray-500 truncate">
                                    {user.email}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className={`mt-4 flex ${collapsed ? 'flex-col items-center space-y-2' : 'flex-col space-y-1'}`}>
                        <Link
                            href={route('profile.edit')}
                            className={`flex items-center py-2 text-sm font-medium rounded-lg transition-colors group ${collapsed ? 'justify-center px-2 w-full' : 'px-2'} text-gray-600 hover:text-indigo-600 hover:bg-indigo-50`}
                            title={collapsed ? "Profile" : undefined}
                        >
                            <span className={`flex-shrink-0 ${collapsed ? '' : 'mr-3'}`}>{icons.profile}</span>
                            {!collapsed && <span>Profile</span>}
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className={`flex items-center py-2 text-sm font-medium text-left rounded-lg transition-colors group w-full ${collapsed ? 'justify-center px-2' : 'px-2'} text-gray-600 hover:text-red-600 hover:bg-red-50`}
                            title={collapsed ? "Log Out" : undefined}
                        >
                            <span className={`flex-shrink-0 ${collapsed ? '' : 'mr-3'}`}>{icons.logout}</span>
                            {!collapsed && <span>Log Out</span>}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Desktop Sidebar */}
            <div className={`hidden sm:flex sm:flex-col sm:fixed sm:inset-y-0 z-20 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'sm:w-20' : 'sm:w-72'}`}>
                {/* Collapse Button */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="absolute -right-3 top-24 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm text-gray-500 hover:text-indigo-600 focus:outline-none transition-transform hover:scale-110"
                >
                    <svg
                        className={`h-4 w-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <SidebarContent collapsed={isSidebarCollapsed} />
            </div>

            {/* Mobile Sidebar overlay */}
            <div className={`relative z-40 sm:hidden ${showingNavigationDropdown ? '' : 'hidden'}`} role="dialog" aria-modal="true">
                <div 
                    className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" 
                    onClick={() => setShowingNavigationDropdown(false)}
                ></div>

                <div className="fixed inset-0 z-40 flex">
                    <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white shadow-2xl pb-4">
                        <div className="absolute right-0 top-0 -mr-12 pt-4">
                            <button
                                type="button"
                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/20 text-white hover:bg-gray-900/40 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                                onClick={() => setShowingNavigationDropdown(false)}
                            >
                                <span className="sr-only">Close sidebar</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <SidebarContent collapsed={false} />
                    </div>
                    <div className="w-14 shrink-0" aria-hidden="true">
                        {/* Force sidebar to shrink to fit close icon */}
                    </div>
                </div>
            </div>

            {/* Main Content area */}
            <div className={`flex flex-1 flex-col w-full transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'sm:pl-20' : 'sm:pl-72'}`}>
                {/* Mobile top navigation header */}
                <div className="sticky top-0 z-10 flex h-20 flex-shrink-0 items-center bg-white shadow-sm sm:hidden px-4 border-b border-gray-200">
                    <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        onClick={() => setShowingNavigationDropdown(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex flex-1 justify-center px-4">
                        <Link href="/" className="flex items-center gap-2">
                            <ApplicationLogo className="block h-8 w-auto fill-current text-indigo-600" />
                        </Link>
                    </div>
                    <div className="w-10"></div> {/* Spacer to center the logo */}
                </div>

                <main className="flex-1 overflow-y-auto focus:outline-none bg-gray-50">
                    {header && (
                        <header className="bg-white shadow-sm border-b border-gray-200 relative z-10">
                            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
