import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard({ sellerStats }) {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">
            {user.role === 'seller' ? 'Seller Dashboard' : 'User Dashboard'}
        </h2>}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Seller Hero Section */}
                    {user.role === 'seller' && sellerStats && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-indigo-500">
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Orders</div>
                                <div className="mt-2 text-3xl font-extrabold text-gray-900">{sellerStats.total_orders}</div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-green-500">
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Stocks Available</div>
                                <div className="mt-2 text-3xl font-extrabold text-gray-900">{sellerStats.stocks_available ?? 0}</div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-yellow-500">
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Scheduled for Ship Out</div>
                                <div className="mt-2 text-3xl font-extrabold text-gray-900">{sellerStats.orders_scheduled}</div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Welcome, {user.role === 'seller' ? 'Seller' : 'User'}!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
