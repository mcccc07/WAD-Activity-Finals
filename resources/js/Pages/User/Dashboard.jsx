import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

function StarRating({ productId, initialRating = 0, avgRating = 0, reviewCount = 0 }) {
    const [hovered, setHovered] = useState(0);
    const [selected, setSelected] = useState(initialRating);
    const [submitted, setSubmitted] = useState(false);
    const [comment, setComment] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = () => {
        if (!selected) return;
        router.post(route('reviews.store'), { product_id: productId, rating: selected, comment }, {
            preserveScroll: true,
            onSuccess: () => { setSubmitted(true); setShowForm(false); },
        });
    };

    return (
        <div className="mt-3">
            <div className="flex items-center gap-1 mb-1">
                {[1,2,3,4,5].map((star) => (
                    <svg key={star} className={`w-4 h-4 ${star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                ))}
                <span className="text-xs text-gray-500 ml-1">
                    {avgRating ? `${parseFloat(avgRating).toFixed(1)} (${reviewCount})` : 'No reviews yet'}
                </span>
            </div>
            {!submitted ? (
                <button onClick={() => setShowForm(!showForm)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                    {initialRating ? 'Edit your review' : 'Rate this product'}
                </button>
            ) : (
                <p className="text-xs text-green-600 font-medium">✓ Review submitted!</p>
            )}
            {showForm && (
                <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="flex items-center gap-1 mb-2">
                        {[1,2,3,4,5].map((star) => (
                            <button key={star} type="button" onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => setSelected(star)} className="focus:outline-none transition-transform hover:scale-110">
                                <svg className={`w-6 h-6 transition-colors ${star <= (hovered || selected) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                            </button>
                        ))}
                    </div>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional comment..." className="w-full text-xs border border-gray-200 rounded-md p-2 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400" rows={2}/>
                    <div className="flex gap-2 mt-2">
                        <button onClick={handleSubmit} disabled={!selected} className="flex-1 py-1 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">Submit</button>
                        <button onClick={() => setShowForm(false)} className="px-3 py-1 text-xs font-semibold rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Dashboard({ sellerStats, sellerProducts, availableProducts }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [toast, setToast] = useState(flash?.success ? { message: flash.success, type: 'success' } : null);
    const [loadingId, setLoadingId] = useState(null);

    const handleAddToCart = (product) => {
        setLoadingId(product.id);
        router.post(route('cart.store'), { product_id: product.id }, {
            preserveScroll: true,
            onSuccess: () => { setToast({ message: `"${product.name}" added to cart!`, type: 'success' }); setLoadingId(null); },
            onError: () => { setToast({ message: 'Failed to add to cart.', type: 'error' }); setLoadingId(null); },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{user.role === 'seller' ? 'Seller Dashboard' : 'User Dashboard'}</h2>}>
            <Head title="Dashboard" />

            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    <span>{toast.type === 'success' ? '✓' : '✕'}</span>
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100">✕</button>
                </div>
            )}

            <div className="py-3">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Welcome, {user.role === 'seller' ? 'Seller' : 'User'}!</div>
                    </div>

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
                                            {sellerProducts.length > 0 ? sellerProducts.map((product) => {
                                                const stock = product.pivot?.stock || 0;
                                                const price = product.pivot?.price || product.price;
                                                let statusColor = 'bg-red-100 text-red-800', statusText = 'Out of Stock';
                                                if (stock > 20) { statusColor = 'bg-green-100 text-green-800'; statusText = 'High Stock'; }
                                                else if (stock > 0) { statusColor = 'bg-yellow-100 text-yellow-800'; statusText = 'Low Stock'; }
                                                return (
                                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(price).toFixed(2)}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>{statusText}</span></td>
                                                    </tr>
                                                );
                                            }) : (
                                                <tr><td colSpan="4" className="px-6 py-4 text-sm text-gray-500 text-center">No products found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {user.role === 'user' && availableProducts && (
                        <div className="mt-8">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Available Products</h3>
                            <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                                {availableProducts.map((product) => {
                                    const seller = product.sellers?.[0] ?? null;
                                    const price = seller?.pivot?.price || 0;
                                    const stock = seller?.pivot?.stock || 0;
                                    const shopName = seller?.shop_name || 'Unknown Shop';
                                    const isLoading = loadingId === product.id;
                                    return (
                                        <div key={product.id} className="group relative bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden hover:shadow-lg transition-all duration-200">
                                            <div className="w-full overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 h-48 flex items-center justify-center">
                                                <svg className="h-20 w-20 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                </svg>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                                                    <p className="mt-1 text-xs text-gray-500">Sold by {shopName}</p>
                                                    <StarRating
                                                        productId={product.id}
                                                        initialRating={product.user_review?.rating || 0}
                                                        avgRating={product.avg_rating || 0}
                                                        reviewCount={product.review_count || 0}
                                                    />
                                                </div>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <p className="text-lg font-bold text-gray-900">${parseFloat(price).toFixed(2)}</p>
                                                    <p className={`text-xs font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{stock > 0 ? `${stock} in stock` : 'Out of stock'}</p>
                                                </div>
                                                <div className="mt-4">
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        disabled={stock <= 0 || isLoading}
                                                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        {isLoading ? (
                                                            <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Adding...</>
                                                        ) : (
                                                            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> Add to Cart</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {availableProducts.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
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
