import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="E-store" />
            <div className="items-top relative flex min-h-screen justify-center bg-gray-100 py-4 sm:items-center sm:pt-0 dark:bg-gray-900">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="flex justify-center pt-8 sm:justify-start sm:pt-0">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Welcome to E-store</h1>
                    </div>

                    <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-lg dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div id="screenshot-container" className="flex items-center justify-center p-6">
                                <img
                                    src="https://ecomwarrioracademy.com/wp-content/uploads/2020/08/ecommerce-store.jpg"
                                    alt="E-store Screenshot"
                                    onError={handleImageError}
                                    className="h-auto max-w-full rounded-lg shadow-md"
                                />
                            </div>
                            <div id="docs-card" className="row-span-2 flex items-center justify-center p-6">
                                <div id="docs-card-content" className="flex flex-col items-center gap-4 text-center">
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Explore E-store</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Dive into the world of online shopping with E-store. Browse products, read reviews, and enjoy a seamless
                                        shopping experience.
                                    </p>
                                    <div className="flex gap-3">
                                        <Link href="/products" className="rounded bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700">
                                            View Products
                                        </Link>
                                        <Link href="/login" className="rounded bg-gray-600 px-5 py-2 text-white transition hover:bg-gray-700">
                                            Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
