import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function SellerRequests({ requests }) {
    const { patch, processing } = useForm();

    const approveRequest = (id) => {
        patch(route('admin.approve_seller', id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Seller Requests</h2>}>
            <Head title="Seller Requests" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h1 className="text-lg font-bold">Pending Seller Approvals</h1>
                            <Link
                                href={route('admin.index')}
                                className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                            >
                                Back to Dashboard
                            </Link>
                        </div>

                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border px-4 py-2">User Name</th>
                                    <th className="border px-4 py-2">Shop Name</th>
                                    <th className="border px-4 py-2">Description</th>
                                    <th className="border px-4 py-2">Date Applied</th>
                                    <th className="border px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests && requests.data && requests.data.length > 0 ? (
                                    requests.data.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">{request.user?.name}</td>
                                            <td className="border px-4 py-2">{request.shop_name}</td>
                                            <td className="border px-4 py-2">{request.shop_description || 'N/A'}</td>
                                            <td className="border px-4 py-2">{new Date(request.created_at).toLocaleDateString()}</td>
                                            <td className="border px-4 py-2 text-center">
                                                <button
                                                    onClick={() => approveRequest(request.id)}
                                                    disabled={processing}
                                                    className="rounded bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                                                >
                                                    Approve
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="border px-4 py-2 text-center text-gray-500 py-8">
                                            No pending seller requests.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="mt-6">
                            {/* Simple pagination or full pagination */}
                            {requests.links && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Showing {requests.from || 0} to {requests.to || 0} of {requests.total}</span>
                                    <div className="flex gap-2">
                                        {requests.prev_page_url ? (
                                            <Link href={requests.prev_page_url} className="px-3 py-1 border rounded hover:bg-gray-50">Previous</Link>
                                        ) : (
                                            <span className="px-3 py-1 border rounded text-gray-400 bg-gray-50 cursor-not-allowed">Previous</span>
                                        )}
                                        {requests.next_page_url ? (
                                            <Link href={requests.next_page_url} className="px-3 py-1 border rounded hover:bg-gray-50">Next</Link>
                                        ) : (
                                            <span className="px-3 py-1 border rounded text-gray-400 bg-gray-50 cursor-not-allowed">Next</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
