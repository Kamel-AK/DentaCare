import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from "react";
import { 
  HiCalendar,
  HiClock,
  HiCheckCircle,
  HiDocumentText,
  HiArrowLeft,
  HiUserCircle
} from "react-icons/hi2";
import { motion } from 'framer-motion';

export default function Create({ auth, patient, errors }) {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        status: 'لايوجد',
        notes: ''
    });
    const [isPastDue, setIsPastDue] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    useEffect(() => {
        if (formData.date && formData.time) {
            const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
            setIsPastDue(selectedDateTime < new Date());
        }
    }, [formData.date, formData.time]);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('patient.appointments.store', patient.id), formData, {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                setFormData({
                    date: '',
                    time: '',
                    status: '',
                    notes: ''
                });
            }
        });
    };

    const statusOptions = [
        { value: 'مجدول', label: 'مجدول' },
        { value: 'مكتمل', label: 'مكتمل' },
        { value: 'تم الإلغاء', label: 'تم الإلغاء' },
        { value: 'لايوجد', label: 'لايوجد' }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route("patient.show", { patient: patient.id })}
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                        >
                            <HiArrowLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Create Appointment for {patient.name}
                        </h2>
                    </div>
                    <Link
                        href={route("patient.show", { patient: patient.id })}
                        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-lg transition-all duration-200"
                    >
                        <span>Back to Patient</span>
                    </Link>
                </div>
            }
        >
            <Head title={`Create Appointment - ${patient.name}`} />
            
            <div className="py-8">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-xl"
                    >
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {showSuccess && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-emerald-500 py-3 px-4 text-white rounded-lg mb-6 shadow-md flex items-center gap-2"
                                >
                                    <HiCheckCircle className="w-5 h-5" />
                                    Appointment created successfully!
                                </motion.div>
                            )}

                            {/* Patient Info Section */}
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <HiUserCircle className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                            {patient.name}
                                        </h3>
                                        <p className="text-sm text-indigo-600 dark:text-indigo-400">
                                            File Number: {patient.file_number}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Date and Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Date
                                        </label>
                                        <div className="relative">
                                            <HiCalendar className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            <input
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border-0 ring-1 ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700"
                                                required
                                            />
                                        </div>
                                        {errors.date && 
                                            <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Time
                                        </label>
                                        <div className="relative">
                                            <HiClock className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            <input
                                                type="time"
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border-0 ring-1 ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700"
                                                required
                                            />
                                        </div>
                                        {errors.time && 
                                            <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Status
                                        {isPastDue && formData.status === 'مجدول' && (
                                            <span className="ml-2 text-xs text-red-500">
                                                (لا يمكن تعين هذا الموعد على انه"مجدول"لانه قد مضى)
                                            </span>
                                        )}
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-0 ring-1 ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700"
                                        required
                                    >
                                        {statusOptions.map(option => (
                                            <option 
                                                key={option.value} 
                                                value={option.value}
                                                disabled={isPastDue && option.value === 'مجدول'}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && 
                                        <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Notes
                                    </label>
                                    <div className="relative">
                                        <HiDocumentText className="absolute top-4 left-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border-0 ring-1 ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700"
                                            rows="4"
                                            placeholder="Add any additional notes..."
                                        />
                                    </div>
                                    {errors.notes && 
                                        <p className="text-red-500 text-sm mt-1">{errors.notes}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Link
                                    href={route('patient.show', { patient: patient.id })}
                                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <HiCheckCircle className="w-5 h-5" />
                                    Create Appointment
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}