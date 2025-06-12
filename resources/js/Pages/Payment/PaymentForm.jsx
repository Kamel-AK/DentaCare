import { useForm } from '@inertiajs/react';
import { HiXMark } from 'react-icons/hi2';

const PaymentForm = ({ treatment, patient, onClose}) => {
    const { data, setData, post, processing, errors } = useForm({
        amount: treatment?.cost - treatment?.paid_amount || 0,
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
        treatment_record_id: treatment?.id,
        patient_id: patient.id,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('patients.payments.store', { 
            patient: patient.id,
            treatment: treatment.id 
        }), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/30 dark:bg-gray-900/80 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Record Payment for {treatment?.name}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <HiXMark className="w-7 h-7" />
                    </button>
                </div>
                
                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Amount *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.amount}
                                onChange={e => setData('amount', parseFloat(e.target.value))}
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                                required
                            />
                            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Payment Date *
                            </label>
                            <input
                                type="date"
                                value={data.payment_date}
                                onChange={e => setData('payment_date', e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Notes
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 h-24"
                                placeholder="Payment notes..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-70"
                        >
                            {processing ? 'Processing...' : 'Record Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;