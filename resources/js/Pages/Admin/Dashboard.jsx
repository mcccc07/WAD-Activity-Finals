import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Dashboard() {
    
    const { users, allProducts } = usePage().props;
    const [userToDelete, setUserToDelete] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);

    const confirmUserDeletion = (user) => {
        setUserToDelete(user);
    };

    const confirmProductDeletion = (product) => {
        setProductToDelete(product);
    };

    const deleteUser = () => {
        if (userToDelete) {
            router.delete(route('users.destroy', userToDelete.id), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteProduct = () => {
        if (productToDelete) {
            router.delete(route('seller.products.destroy', productToDelete.id), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setUserToDelete(null);
        setProductToDelete(null);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Admin Dashboard</h2>}>
            <Head title="Admin Dashboard" />

            <div className="py-12 space-y-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* USER TABLE SECTION */}
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h1 className="text-lg font-bold">User Table</h1>
                            <Link
                                href={route('users.create')}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                            >
                                + Add User
                            </Link>
                        </div>

                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border px-4 py-2">User ID</th>
                                    <th className="border px-4 py-2">Full Name</th>
                                    <th className="border px-4 py-2">Email</th>
                                    <th className="border px-4 py-2">Role</th>
                                    <th className="border px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.data && users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">{user.id}</td>
                                            <td className="border px-4 py-2">{user.name}</td>
                                            <td className="border px-4 py-2">{user.email}</td>
                                            <td className="border px-4 py-2">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                        user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="border px-4 py-2 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={route('users.show', user.id)}
                                                        className="rounded bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={route('users.edit', user.id)}
                                                        className="rounded bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-200 transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => confirmUserDeletion(user)}
                                                        className="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="border px-4 py-2 text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Section (Users) */}
                        <div className="mt-6 flex flex-col items-center justify-between sm:flex-row">
                            <span className="text-sm text-gray-600">
                                Showing {users.from || 0} to {users.to || 0} of {users.total} users
                            </span>
                            {users.links && users.links.length > 3 && (
                                <div className="flex space-x-1">
                                    {users.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 border rounded ${link.active ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* NEW: PRODUCT TABLE SECTION FOR ADMIN */}
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <div className="mb-4">
                            <h1 className="text-lg font-bold">All Sellers' Products</h1>
                            <p className="text-sm text-gray-500">Monitor and manage all products across the platform.</p>
                        </div>

                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border px-4 py-2">ID</th>
                                    <th className="border px-4 py-2">Product Name</th>
                                    <th className="border px-4 py-2">Seller/Shop</th>
                                    <th className="border px-4 py-2">Price</th>
                                    <th className="border px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allProducts && allProducts.length > 0 ? (
                                    allProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">{product.id}</td>
                                            <td className="border px-4 py-2 font-medium">{product.name}</td>
                                            <td className="border px-4 py-2 text-blue-600 italic">
                                                {product.sellers && product.sellers.length > 0 
                                                    ? product.sellers[0].shop_name 
                                                    : 'N/A'}
                                            </td>
                                            <td className="border px-4 py-2">${product.price}</td>
                                            <td className="border px-4 py-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => confirmProductDeletion(product)}
                                                    className="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                                                >
                                                    Delete Product
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="border px-4 py-2 text-center text-gray-500">
                                            No products found in the database.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal for User Deletion */}
            <Modal show={userToDelete !== null} onClose={closeModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Are you sure you want to delete this user?</h2>
                    <div className="mt-4 flex justify-end gap-3">
                        <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button onClick={deleteUser} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete User</button>
                    </div>
                </div>
            </Modal>

            {/* Modal for Product Deletion */}
            <Modal show={productToDelete !== null} onClose={closeModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 text-red-600">Delete Product?</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Warning: This will permanently remove <b>{productToDelete?.name}</b> from the shop.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button onClick={deleteProduct} className="px-4 py-2 bg-red-600 text-white rounded-lg">Confirm Delete</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}