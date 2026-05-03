import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard({ sellerStats, sellerProducts, availableProducts }) {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">
            {user.role === 'seller' ? 'Seller Dashboard' : 'User Dashboard'}
        </h2>}>
            <Head title="Dashboard" />

            <div className="py-3">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Welcome, {user.role === 'seller' ? 'Seller' : 'User'}!
                        </div>
                    </div>
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

                    {/* Recent Products Table */}
                    {user.role === 'seller' && sellerProducts && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Recent Products</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {sellerProducts.length > 0 ? (
                                                sellerProducts.map((product) => {
                                                    const stock = product.pivot?.stock || 0;
                                                    const price = product.pivot?.price || product.price;
                                                    
                                                    // Determine stock status logic
                                                    let statusColor = 'bg-red-100 text-red-800';
                                                    let statusText = 'Out of Stock';
                                                    
                                                    if (stock > 20) {
                                                        statusColor = 'bg-green-100 text-green-800';
                                                        statusText = 'High Stock';
                                                    } else if (stock > 0) {
                                                        statusColor = 'bg-yellow-100 text-yellow-800';
                                                        statusText = 'Low Stock';
                                                    }

                                                    return (
                                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(price).toFixed(2)}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                                                                    {statusText}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                        No products found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Available Products Storefront for Regular Users */}
                    {user.role === 'user' && availableProducts && (
                        <div className="mt-8">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Available Products</h3>
                            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                                {availableProducts.map((product) => {
                                    // For simplicity, grab the first seller's details
                                    const seller = product.sellers && product.sellers.length > 0 ? product.sellers[0] : null;
                                    const price = seller?.pivot?.price || product.price;
                                    const stock = seller?.pivot?.stock || 0;
                                    const shopName = seller?.shop_name || 'Unknown Shop';

                                    return (
                                        <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-100 sm:aspect-none sm:h-48 flex items-center justify-center">
                                                {/* Placeholder for product image */}
                                                <svg className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900">
                                                        <a href="#">
                                                            <span aria-hidden="true" className="absolute inset-0" />
                                                            {product.name}
                                                        </a>
                                                    </h3>
                                                    <p className="mt-1 text-xs text-gray-500">Sold by {shopName}</p>
                                                </div>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <p className="text-lg font-bold text-gray-900">${parseFloat(price).toFixed(2)}</p>
                                                    <p className={`text-xs font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                                                    </p>
                                                </div>
                                                <div className="mt-4 flex flex-col gap-2 relative z-10">
                                                    <button 
                                                        disabled={stock <= 0}
                                                        className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {availableProducts.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No products available</h3>
                                    <p className="mt-1 text-sm text-gray-500">Check back later for new arrivals.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
