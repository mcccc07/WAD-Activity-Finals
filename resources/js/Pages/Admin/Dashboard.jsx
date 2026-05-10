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
                        <div className="mt-6 mb-2 flex flex-col items-center justify-between sm:flex-row">
                            <span className="text-sm text-gray-600 mb-4 sm:mb-0">
                                Showing {users.from || 0} to {users.to || 0} of {users.total} users
                            </span>
                            
                            {users.links && users.links.length > 3 && (
                                <div className="flex">
                                    <nav className="inline-flex -space-x-px rounded-md shadow-sm bg-white border border-gray-300">
                                        {users.links.map((link, index) => {
                                            const isFirst = index === 0;
                                            const isLast = index === users.links.length - 1;
                                            
                                            let content = <span dangerouslySetInnerHTML={{ __html: link.label }} />;
                                            if (link.label.includes('Previous')) {
                                                content = (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                );
                                            } else if (link.label.includes('Next')) {
                                                content = (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                );
                                            } else if (link.label === '...') {
                                                content = <span>...</span>;
                                            }

                                            // Determine rounded corners
                                            let roundedClass = '';
                                            if (isFirst) roundedClass = 'rounded-l-md';
                                            if (isLast) roundedClass = 'rounded-r-md';

                                            // Base classes
                                            let baseClass = `flex items-center justify-center px-4 py-2 text-sm font-medium border-gray-300 border-x hover:bg-gray-50 transition-colors focus:z-20 focus:outline-offset-0 ${roundedClass}`;
                                            
                                            // Handle borders for first and last to prevent double borders
                                            if (isFirst) baseClass = baseClass.replace('border-x', 'border-r');
                                            if (isLast) baseClass = baseClass.replace('border-x', 'border-l');
                                            if (!isFirst && !isLast) baseClass = baseClass.replace('border-x', 'border-r'); // all middle elements have right border
                                            
                                            // If last element, remove the right border as the container has a border
                                            if (isLast) {
                                                baseClass = baseClass.replace('border-r', '');
                                            }

                                            if (link.active) {
                                                // Active styling
                                                return (
                                                    <span key={index} aria-current="page" className={`z-10 bg-gray-900 text-white ${baseClass.replace('hover:bg-gray-50', '')}`}>
                                                        {content}
                                                    </span>
                                                );
                                            }

                                            if (!link.url) {
                                                // Disabled styling
                                                return (
                                                    <span key={index} className={`text-gray-400 cursor-not-allowed bg-gray-50 ${baseClass.replace('hover:bg-gray-50', '')}`}>
                                                        {content}
                                                    </span>
                                                );
                                            }

                                            // Default link styling
                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`text-gray-700 hover:text-gray-900 ${baseClass}`}
                                                    preserveScroll
                                                >
                                                    {content}
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>
                            )}
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
