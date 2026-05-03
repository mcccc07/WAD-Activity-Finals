import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [showProducts, setShowProducts] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    const handleViewProducts = async () => {
        if (showProducts) {
            setShowProducts(false);
            return;
        }
        setLoading(true);
        setShowProducts(true);
        try {
            const res = await fetch('/products');
            const data = await res.json();
            setProducts(data);
        } catch (e) {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowAuthModal(true);
    };

    const closeModal = () => {
        setShowAuthModal(false);
        setSelectedProduct(null);
    };

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') closeModal(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const formatPrice = (price) =>
        parseFloat(price).toLocaleString('en-PH', { minimumFractionDigits: 2 });

    return (
        <>
            <Head title="E-store" />

            <div className="items-top relative flex min-h-screen justify-center bg-gray-100 py-4 sm:items-center sm:pt-0 dark:bg-gray-900">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">

                    {/* Title */}
                    <div className="flex justify-center pt-8 sm:justify-start sm:pt-0">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Welcome to E-store</h1>
                    </div>

                    {/* Hero card */}
                    <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-lg dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2">

                            {/* Left: image */}
                            <div id="screenshot-container" className="flex items-center justify-center p-6">
                                <img
                                    src="https://ecomwarrioracademy.com/wp-content/uploads/2020/08/ecommerce-store.jpg"
                                    alt="E-store Screenshot"
                                    onError={handleImageError}
                                    className="h-auto max-w-full rounded-lg shadow-md"
                                />
                            </div>

                            {/* Right: text + buttons */}
                            <div id="docs-card" className="row-span-2 flex items-center justify-center p-6">
                                <div id="docs-card-content" className="flex flex-col items-center gap-4 text-center">
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Explore E-store</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Dive into the world of online shopping with E-store. Browse products, read reviews, and enjoy a seamless shopping experience.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleViewProducts}
                                            className="rounded bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                                        >
                                            {showProducts ? 'Hide Products' : 'View Products'}
                                        </button>
                                        <Link
                                            href="/login"
                                            className="rounded bg-gray-600 px-5 py-2 text-white transition hover:bg-gray-700"
                                        >
                                            Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Products Section ── */}
                    {showProducts && (
                        <div className="mt-8">
                            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                                Available Products
                                {!loading && (
                                    <span className="ml-3 rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                        {products.length} items
                                    </span>
                                )}
                            </h2>

                            {/* Skeleton loading */}
                            {loading && (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className="animate-pulse rounded-lg bg-white p-5 shadow dark:bg-gray-800">
                                            <div className="mb-3 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                                            <div className="mb-2 h-3 w-3/5 rounded bg-gray-200 dark:bg-gray-700" />
                                            <div className="mb-4 h-3 w-2/5 rounded bg-gray-200 dark:bg-gray-700" />
                                            <div className="h-8 rounded bg-gray-200 dark:bg-gray-700" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Empty state */}
                            {!loading && products.length === 0 && (
                                <div className="rounded-lg bg-white py-16 text-center shadow dark:bg-gray-800">
                                    <p className="text-4xl">📭</p>
                                    <p className="mt-3 text-lg font-medium text-gray-600 dark:text-gray-300">No products available yet.</p>
                                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Check back soon!</p>
                                </div>
                            )}

                            {/* Product grid */}
                            {!loading && products.length > 0 && (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => handleProductClick(product)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleProductClick(product)}
                                            className="cursor-pointer rounded-lg bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
                                        >
                                            <div className="mb-3 text-center text-3xl">🛍️</div>
                                            <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-800 dark:text-white">
                                                {product.name}
                                            </h3>
                                            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                                                by <span className="font-medium text-blue-600 dark:text-blue-400">{product.seller}</span>
                                            </p>
                                            <div className="mb-4 flex items-center justify-between">
                                                <span className="text-base font-bold text-green-600 dark:text-green-400">
                                                    ₱{formatPrice(product.price)}
                                                </span>
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    product.stock > 0
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                        : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                                                }`}>
                                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                                </span>
                                            </div>
                                            <button className="w-full rounded bg-blue-600 py-2 text-xs font-semibold text-white transition hover:bg-blue-700">
                                                View Details →
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* ── Login / Register Modal ── */}
            {showAuthModal && selectedProduct && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        className="relative w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="bg-blue-600 px-6 py-5 text-center">
                            <div className="mb-2 text-4xl">🔒</div>
                            <h2 className="text-lg font-bold text-white">Sign in to continue</h2>
                            <p className="mt-1 text-sm text-blue-100">
                                You need an account to purchase this item
                            </p>
                        </div>

                        {/* Product preview */}
                        <div className="mx-6 mt-5 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-700">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                                    Selected product
                                </p>
                                <p className="mt-0.5 text-sm font-semibold text-gray-800 dark:text-white line-clamp-1">
                                    {selectedProduct.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">by {selectedProduct.seller}</p>
                            </div>
                            <span className="ml-4 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
                                ₱{formatPrice(selectedProduct.price)}
                            </span>
                        </div>

                        {/* Auth buttons */}
                        <div className="px-6 pb-6 pt-4">
                            <Link
                                href="/login"
                                className="block w-full rounded bg-blue-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Login to Your Account
                            </Link>
                            <Link
                                href="/register"
                                className="mt-3 block w-full rounded border border-gray-300 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Create a New Account
                            </Link>
                            <button
                                onClick={closeModal}
                                className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            >
                                Maybe later
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
