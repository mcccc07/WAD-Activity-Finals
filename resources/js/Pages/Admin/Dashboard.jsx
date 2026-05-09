import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Dashboard() {
    const { users } = usePage().props;
    const [userToDelete, setUserToDelete] = useState(null);

    const confirmUserDeletion = (user) => {
        setUserToDelete(user);
    };

    const deleteUser = () => {
        if (userToDelete) {
            router.delete(route('users.destroy', userToDelete.id), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setUserToDelete(null);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Admin Dashboard</h2>}>
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
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

                        {/* Pagination */}
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Showing {users.from} to {users.to} of {users.total} users
                            </span>
                            <div className="flex gap-2">
                                {users.prev_page_url ? (
                                    <Link
                                        href={users.prev_page_url}
                                        className="rounded border bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                ) : (
                                    <span className="cursor-not-allowed rounded border bg-gray-100 px-4 py-2 text-sm text-gray-400">Previous</span>
                                )}

                                <span className="rounded border bg-gray-800 px-4 py-2 text-sm text-white">
                                    Page {users.current_page} of {users.last_page}
                                </span>

                                {users.next_page_url ? (
                                    <Link
                                        href={users.next_page_url}
                                        className="rounded border bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Next
                                    </Link>
                                ) : (
                                    <span className="cursor-not-allowed rounded border bg-gray-100 px-4 py-2 text-sm text-gray-400">Next</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={userToDelete !== null} onClose={closeModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Are you sure you want to delete this user?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Once the user is deleted, all of their resources and data will be permanently deleted.
                        {userToDelete && (
                            <span className="block mt-4 rounded-md bg-gray-50 p-3 text-sm text-gray-800 border border-gray-200">
                                <span className="font-semibold block">{userToDelete.name}</span>
                                <span className="text-gray-500">{userToDelete.email}</span>
                            </span>
                        )}
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={deleteUser}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                        >
                            Delete User
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
