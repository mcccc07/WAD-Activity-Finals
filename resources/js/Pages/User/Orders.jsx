import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';

function StarRating({ productId, initialRating = 0 }) {
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
        <div className="mt-4 border-t border-gray-100 pt-4">
            {!submitted && !initialRating ? (
                <>
                    <button onClick={() => setShowForm(!showForm)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        Rate & Review this product
                    </button>
                    {showForm && (
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                                {[1,2,3,4,5].map((star) => (
                                    <button key={star} type="button" onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => setSelected(star)} className="focus:outline-none transition-transform hover:scale-110">
                                        <svg className={`w-8 h-8 transition-colors ${star <= (hovered || selected) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    </button>
                                ))}
                            </div>
                            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell us what you think..." className="w-full text-sm border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400 mb-3" rows={3}/>
                            <div className="flex gap-2">
                                <button onClick={handleSubmit} disabled={!selected} className="px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">Submit Review</button>
                                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-semibold rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600">✓ Review submitted</span>
                    <div className="flex">
                        {[1,2,3,4,5].map((star) => (
                            <svg key={star} className={`w-4 h-4 ${star <= (selected || initialRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Orders({ orders }) {
    
    const confirmDelivery = (orderId) => {
        if(confirm("Are you sure you have received this order?")) {
            router.patch(route('orders.confirm_delivery', orderId), {}, { preserveScroll: true });
        }
    };

    const getProgressIndex = (status) => {
        const statuses = ['pending', 'packing', 'in_delivery', 'out_for_delivery', 'delivered'];
        return statuses.indexOf(status) >= 0 ? statuses.indexOf(status) : 0;
    };

    const steps = [
        { id: 'pending', label: 'Order Placed' },
        { id: 'packing', label: 'Packing' },
        { id: 'in_delivery', label: 'In Delivery' },
        { id: 'out_for_delivery', label: 'Out for Delivery' },
        { id: 'delivered', label: 'Delivered' },
    ];

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Orders</h2>}>
            <Head title="My Orders" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {orders.length > 0 ? orders.map(order => {
                        const currentStepIndex = getProgressIndex(order.status);
                        
                        return (
                            <div key={order.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-extrabold text-gray-900">${parseFloat(order.total_price).toFixed(2)}</p>
                                        <p className="text-sm font-medium text-indigo-600 uppercase">{order.status.replace(/_/g, ' ')}</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="py-6 mb-6">
                                    <div className="relative">
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                                            <div style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"></div>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium text-gray-500 absolute w-full" style={{ top: '15px' }}>
                                            {steps.map((step, index) => (
                                                <div key={step.id} className={`flex flex-col items-center ${index <= currentStepIndex ? 'text-indigo-600 font-bold' : ''}`} style={{ width: '20%', transform: index === 0 ? 'translateX(-40%)' : index === steps.length - 1 ? 'translateX(40%)' : 'none' }}>
                                                    <span>{step.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-12 space-y-4">
                                    <h4 className="font-semibold text-gray-800">Items:</h4>
                                    {order.items?.map(item => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.product?.name || 'Product deleted'}</p>
                                                    <p className="text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex justify-end gap-4 border-t border-gray-100 pt-6">
                                    {order.status !== 'delivered' && (
                                        <button 
                                            onClick={() => confirmDelivery(order.id)}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                                        >
                                            Confirm Delivery
                                        </button>
                                    )}
                                </div>

                                {/* Review section if delivered */}
                                {order.status === 'delivered' && order.items && order.items.length > 0 && (
                                    <div className="mt-4 border-t border-gray-100 pt-4 bg-indigo-50/30 -mx-6 -mb-6 p-6 rounded-b-lg">
                                        <h4 className="font-semibold text-gray-900 mb-2">Review your purchase</h4>
                                        <p className="text-sm text-gray-600 mb-4">How was the product? Your feedback helps other shoppers.</p>
                                        <StarRating productId={order.items[0].product_id} />
                                    </div>
                                )}
                            </div>
                        );
                    }) : (
                        <div className="bg-white p-12 rounded-lg shadow-sm text-center border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                            <p className="mt-1 text-gray-500">When you buy products, they will appear here.</p>
                            <Link href={route('dashboard')} className="mt-4 inline-block text-indigo-600 font-medium hover:text-indigo-800">Browse Products &rarr;</Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
