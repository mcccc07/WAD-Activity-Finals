import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ products }) {
    const [productToDelete, setProductToDelete] = useState(null);

    const confirmDeletion = (product) => {
        setProductToDelete(product);
    };

    const deleteProduct = () => {
        if (productToDelete) {
            router.delete(route('seller.products.destroy', productToDelete.id), {
                preserveScroll: true,
                onSuccess: () => setProductToDelete(null),
            });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Products</h2>}>
            <Head title="My Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Manage Products</h3>
                                <Link
                                    href={route('seller.products.create')}
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                                >
                                    + Add New Product
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Product Name</th>
                                            <th className="px-6 py-3 font-medium">Base Price</th>
                                            <th className="px-6 py-3 font-medium">Your Selling Price</th>
                                            <th className="px-6 py-3 font-medium">Stock</th>
                                            <th className="px-6 py-3 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {products.data && products.data.length > 0 ? (
                                            products.data.map((product) => (
                                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                                    <td className="px-6 py-4">${parseFloat(product.price).toFixed(2)}</td>
                                                    <td className="px-6 py-4">
                                                        {product.pivot && product.pivot.price ? (
                                                            <span className="font-semibold text-green-600">
                                                                ${parseFloat(product.pivot.price).toFixed(2)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {product.pivot && product.pivot.stock !== undefined ? (
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                product.pivot.stock > 10 ? 'bg-green-100 text-green-800' : 
                                                                product.pivot.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {product.pivot.stock} in stock
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Link
                                                                href={route('seller.products.edit', product.id)}
                                                                className="rounded bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => confirmDeletion(product)}
                                                                className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                    You haven't added any products yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {products.total > products.per_page && (
                                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                                    <span className="text-sm text-gray-600">
                                        Showing {products.from} to {products.to} of {products.total} products
                                    </span>
                                    <div className="flex gap-2">
                                        {products.prev_page_url ? (
                                            <Link
                                                href={products.prev_page_url}
                                                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                Previous
                                            </Link>
                                        ) : (
                                            <span className="cursor-not-allowed rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-400">Previous</span>
                                        )}
                                        {products.next_page_url ? (
                                            <Link
                                                href={products.next_page_url}
                                                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                Next
                                            </Link>
                                        ) : (
                                            <span className="cursor-not-allowed rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-400">Next</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={productToDelete !== null} onClose={() => setProductToDelete(null)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Delete Product</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => setProductToDelete(null)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={deleteProduct}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Confirm Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
