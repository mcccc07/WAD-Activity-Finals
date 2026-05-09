import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ user }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">View User</h2>}>
            <Head title={`View User - ${user.name}`} />

            <div className="py-9">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <div className="mb-6 flex items-center justify-between">
                            <Link href={route('admin.index')} className="text-sm text-gray-400 hover:text-gray-600">
                                ← Back to Dashboard
                            </Link>
                            <Link
                                href={route('users.edit', user.id)}
                                className="rounded-lg bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-200"
                            >
                                Edit User
                            </Link>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <dl className="divide-y divide-gray-100">
                                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">User ID</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.id}</dd>
                                </div>
                                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Full Name</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.name}</dd>
                                </div>
                                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Email Address</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.email}</dd>
                                </div>
                                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Role</dt>
                                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                user.role === 'admin' ? 'bg-red-100 text-red-700' : (user.role === 'seller' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700')
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </dd>
                                </div>
                                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Joined</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
