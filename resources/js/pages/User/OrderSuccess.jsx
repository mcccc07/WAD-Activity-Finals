import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function OrderSuccess() {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Order Confirmed</h2>}>
            <Head title="Order Confirmed" />
            <div className="py-16">
                <div className="mx-auto max-w-lg sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
                        {/* Animated checkmark */}
                        <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed!</h1>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                            Thank you for your purchase. Your order has been received and is being processed.
                            You'll receive a confirmation shortly.
                        </p>

                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-8 text-left space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <span className="font-semibold text-green-600">✓ Confirmed</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Payment</span>
                                <span className="font-semibold text-gray-900">Demo Payment</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Delivery</span>
                                <span className="font-semibold text-gray-900">3–5 Business Days</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href={route('dashboard')}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
