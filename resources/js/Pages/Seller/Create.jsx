import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        shop_name: '',
        shop_description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('seller.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Become a Seller</h2>}
        >
            <Head title="Become a Seller" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-2xl border border-gray-100">
                        <div className="p-8 sm:p-12 text-gray-900">
                            <div className="max-w-2xl mx-auto">
                                <div className="mb-10 text-center">
                                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Start Your Selling Journey</h3>
                                    <p className="mt-4 text-lg text-gray-500">Fill in the details below to set up your store and start reaching thousands of customers today.</p>
                                </div>
                                <form onSubmit={submit} className="mt-8 space-y-8">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                        <InputLabel htmlFor="shop_name" value="Shop Name" className="text-lg font-medium text-gray-700" />
                                        <TextInput
                                            id="shop_name"
                                            className="mt-2 block w-full text-lg py-3 px-4 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm transition duration-150 ease-in-out"
                                            value={data.shop_name}
                                            onChange={(e) => setData('shop_name', e.target.value)}
                                            required
                                            isFocused
                                            placeholder="e.g. Acme Tech Supplies"
                                        />
                                        <InputError className="mt-2" message={errors.shop_name} />
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                        <InputLabel htmlFor="shop_description" value="Shop Description" className="text-lg font-medium text-gray-700" />
                                        <textarea
                                            id="shop_description"
                                            className="mt-2 block w-full text-lg py-3 px-4 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm transition duration-150 ease-in-out"
                                            value={data.shop_description}
                                            onChange={(e) => setData('shop_description', e.target.value)}
                                            rows="5"
                                            placeholder="Tell customers what you sell..."
                                        ></textarea>
                                        <InputError className="mt-2" message={errors.shop_description} />
                                    </div>

                                    <div className="flex items-center justify-end mt-8">
                                        <PrimaryButton 
                                            className="ml-4 py-3 px-8 text-lg shadow-md hover:shadow-lg rounded-xl" 
                                            disabled={processing}
                                        >
                                            {processing ? 'Creating...' : 'Create Seller Profile'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
