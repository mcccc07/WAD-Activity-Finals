import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Cart({ cartItems }) {
    const [items, setItems] = useState(cartItems);

    const updateQty = (productId, newQty) => {
        if (newQty < 1) return;
        setItems(items.map(i => i.product_id === productId ? { ...i, quantity: newQty } : i));
        router.patch(route('cart.update', productId), { quantity: newQty }, { preserveScroll: true });
    };

    const removeItem = (productId) => {
        setItems(items.filter(i => i.product_id !== productId));
        router.delete(route('cart.destroy', productId), { preserveScroll: true });
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Cart</h2>}>
            <Head title="My Cart" />
            <div className="py-8">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                            <p className="text-sm text-gray-400 mb-6">Start shopping to add items to your cart.</p>
                            <Link href={route('dashboard')} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Cart Items */}
                            <div className="flex-1 space-y-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Cart Items ({items.length})</h3>
                                {items.map((item) => (
                                    <div key={item.product_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-8 h-8 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                                            <p className="text-sm text-indigo-600 font-medium mt-0.5">${parseFloat(item.price).toFixed(2)} each</p>
                                        </div>
                                        {/* Quantity Stepper */}
                                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQty(item.product_id, item.quantity - 1)}
                                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-600 font-bold transition-colors"
                                            >−</button>
                                            <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQty(item.product_id, item.quantity + 1)}
                                                disabled={item.quantity >= item.max_stock}
                                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-600 font-bold transition-colors disabled:opacity-40"
                                            >+</button>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 w-20 text-right">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => removeItem(item.product_id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                                            title="Remove item"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:w-80">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h3>
                                    <div className="space-y-3 mb-5">
                                        {items.map((item) => (
                                            <div key={item.product_id} className="flex justify-between text-sm text-gray-600">
                                                <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                                                <span className="font-medium text-gray-900 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 mb-6">
                                        <div className="flex justify-between text-base font-bold text-gray-900">
                                            <span>Total</span>
                                            <span className="text-indigo-600">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('checkout.index')}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                                        </svg>
                                        Proceed to Checkout
                                    </Link>
                                    <Link href={route('dashboard')} className="w-full flex items-center justify-center mt-3 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                        ← Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
