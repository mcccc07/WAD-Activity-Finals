import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

function InputField({ id, label, type = 'text', placeholder, value, onChange, error, maxLength, pattern, inputMode }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                pattern={pattern}
                inputMode={inputMode}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

export default function Checkout({ cartItems, total }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        card_number: '',
        expiry: '',
        cvv: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('checkout.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Checkout</h2>}>
            <Head title="Checkout" />
            <div className="py-8">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                        {/* Left: Forms */}
                        <div className="flex-1 space-y-6">
                            {/* Shipping Info */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                                    <h3 className="text-base font-bold text-gray-900">Shipping Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <InputField
                                        id="name"
                                        label="Full Name"
                                        placeholder="Juan dela Cruz"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        error={errors.name}
                                    />
                                    <InputField
                                        id="address"
                                        label="Delivery Address"
                                        placeholder="123 Main St, Barangay, City, Province"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        error={errors.address}
                                    />
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                                    <h3 className="text-base font-bold text-gray-900">Payment Details</h3>
                                </div>

                                {/* Card preview */}
                                <div className="mb-5 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-1">
                                            <div className="w-7 h-7 bg-yellow-400 rounded-full opacity-90"/>
                                            <div className="w-7 h-7 bg-orange-400 rounded-full -ml-3 opacity-90"/>
                                        </div>
                                        <span className="text-xs font-semibold tracking-widest opacity-80">DEMO CARD</span>
                                    </div>
                                    <div className="text-lg font-mono tracking-widest mb-4 opacity-90">
                                        {data.card_number ? data.card_number.replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <div>
                                            <p className="opacity-60 mb-0.5">CARD HOLDER</p>
                                            <p className="font-semibold">{data.name || 'Your Name'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="opacity-60 mb-0.5">EXPIRES</p>
                                            <p className="font-semibold">{data.expiry || 'MM/YY'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <InputField
                                        id="card_number"
                                        label="Card Number"
                                        placeholder="1234567890123456"
                                        value={data.card_number}
                                        onChange={(e) => setData('card_number', e.target.value.replace(/\D/g, '').slice(0, 16))}
                                        maxLength={16}
                                        inputMode="numeric"
                                        error={errors.card_number}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField
                                            id="expiry"
                                            label="Expiry (MM/YY)"
                                            placeholder="12/28"
                                            value={data.expiry}
                                            onChange={(e) => {
                                                let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
                                                setData('expiry', v);
                                            }}
                                            maxLength={5}
                                            error={errors.expiry}
                                        />
                                        <InputField
                                            id="cvv"
                                            label="CVV"
                                            placeholder="123"
                                            value={data.cvv}
                                            onChange={(e) => setData('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            maxLength={4}
                                            inputMode="numeric"
                                            error={errors.cvv}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="lg:w-80">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
                                <h3 className="text-base font-bold text-gray-900 mb-4">Order Summary</h3>
                                <div className="space-y-3 mb-4">
                                    {cartItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm text-gray-600">
                                            <span className="truncate mr-2">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                                            <span className="font-medium text-gray-900 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <div className="flex justify-between text-base font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-indigo-600">${parseFloat(total).toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-400 transition-all shadow-sm hover:shadow-md"
                                >
                                    {processing ? (
                                        <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Processing...</>
                                    ) : (
                                        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> Place Order</>
                                    )}
                                </button>
                                <Link href={route('cart.index')} className="w-full flex items-center justify-center mt-3 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                    ← Back to Cart
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
