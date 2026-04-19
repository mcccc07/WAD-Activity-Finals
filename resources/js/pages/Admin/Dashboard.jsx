import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { users } = usePage().props;

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
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="border px-4 py-2 text-center text-gray-500">
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
        </AuthenticatedLayout>
    );
}
