import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit User</h2>}>
            <Head title={`Edit User - ${user.name}`} />

            <div className="py-9">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <div className="mb-6">
                            <Link href={route('admin.index')} className="text-sm text-gray-400 hover:text-gray-600">
                                ← Back to Dashboard
                            </Link>
                        </div>

                        <h1 className="mb-6 text-lg font-bold">Edit User: {user.name}</h1>

                        <form onSubmit={handleSubmit} className="max-w-lg">
                            <Field label="Full Name" error={errors.name}>
                                <input
                                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. John Doe"
                                />
                            </Field>

                            <Field label="Email" error={errors.email}>
                                <input
                                    type="email"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="e.g. john@example.com"
                                />
                            </Field>

                            <Field label="Password (leave blank to keep current)" error={errors.password}>
                                <input
                                    type="password"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimum 8 characters"
                                />
                            </Field>

                            <Field label="Confirm Password" error={errors.password_confirmation}>
                                <input
                                    type="password"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${errors.password_confirmation ? 'border-red-400' : 'border-gray-200'}`}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Repeat password"
                                />
                            </Field>

                            <Field label="Role" error={errors.role}>
                                <select
                                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${errors.role ? 'border-red-400' : 'border-gray-200'}`}
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="seller">Seller</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </Field>

                            <div className="mt-6 flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                    {processing ? 'Saving...' : 'Update User'}
                                </button>
                                <Link href={route('admin.index')} className="text-sm text-gray-400 hover:text-gray-600">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-gray-600">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}
