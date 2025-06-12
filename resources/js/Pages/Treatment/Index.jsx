import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
  HiTrash, 
  HiPencil,
  HiArrowLeft,
  HiCurrencyDollar
} from "react-icons/hi2";
import { motion } from 'framer-motion';

export default function Index({ auth, patient, treatments }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route("patient.show", patient.id)}
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                        >
                            <HiArrowLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">
                            All Treatments for {patient.name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Treatments - ${patient.name}`} />

            <div className="py-8 max-w-8xl mx-auto sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-xl"
                >
                    <div className="p-8">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        {['Date', 'Treatment', 'Appointment', 'Cost', 'Status', 'Payment', 'Actions'].map((header) => (
                                            <th
                                                key={header}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {treatments.data.map((treatment) => (
                                        <tr key={treatment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                {new Date(treatment.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {treatment.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                {treatment.appointment ? (
                                                    <>
                                                        {new Date(treatment.appointment.date).toLocaleDateString()}
                                                        <br />
                                                        <span className="text-xs text-gray-500">
                                                            {treatment.appointment.time}
                                                        </span>
                                                    </>
                                                ) : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                ${treatment.cost.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    treatment.status === 'مكتمل' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30' :
                                                    treatment.status === 'ملغى' ? 'bg-red-100 text-red-800 dark:bg-red-900/30' :
                                                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30'
                                                }`}>
                                                    {treatment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        treatment.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30' :
                                                        treatment.payment_status === 'partially_paid' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30' :
                                                        'bg-red-100 text-red-800 dark:bg-red-900/30'
                                                    }`}>
                                                        {treatment.payment_status}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        (${treatment.payments.reduce((sum, payment) => sum + Number(payment.amount), 0).toFixed(2)}) paid
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center space-x-4">
                                                    <Link
                                                        href={route('patients.treatments.edit', {
                                                            patient: patient.id,
                                                            treatment: treatment.id
                                                        })}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <HiPencil className="w-5 h-5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {treatments.links && (
                            <div className="mt-6 flex justify-center">
                                {Object.entries(treatments.links).map(([key, link]) => (
                                    <Link
                                        key={key}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 mx-1 rounded ${
                                            link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}