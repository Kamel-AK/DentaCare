//show.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  HiOutlineUserCircle,
  HiTrash, 
  HiPencil,
  HiOutlineCalendarDays,
  HiMiniPlus,
  HiArrowLeft,
  HiCalendar,
  HiClock
} from "react-icons/hi2";
import { motion } from 'framer-motion';
import { useState } from 'react'
import DentalChart from "@/Components/DentalChart";
import TreatmentForm from "../Treatment/TreatmentForm";
import PaymentForm from '../Payment/PaymentForm'; 

export default function Show({ auth, patient, success, appointments , treatments }) {
    // Delete functions
    const deletePatient = () => {
        if (!window.confirm(`Delete ${patient.name}?`)) return;
        router.delete(route('patient.destroy', patient.id));
    };
    
    const deleteAppointment = (appointmentId) => {
        if (!window.confirm(`Delete this appointment?`)) return;
        router.delete(route('patient.appointments.destroy', { 
            patient: patient.id, 
            appointment: appointmentId 
        }));
    }

    // State management
    const [filters, setFilters] = useState({
        date: '',
        time: '',
        status: ''
    });

    const [selectedTooth, setSelectedTooth] = useState('');
    const [showTreatmentForm, setShowTreatmentForm] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [expandedTreatments, setExpandedTreatments] = useState([]);

    // Status colors configuration
    const statusColors = {
        'مجدول': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30',
        'مكتمل': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30',
        'تم الإلغاء': 'bg-red-100 text-red-800 dark:bg-red-900/30',
        'لايوجد': 'bg-gray-100 text-gray-800 dark:bg-gray-700'
    };
    const deleteTreatment = (treatmentId) => {
        if (!window.confirm('Delete this treatment?')) return;
        router.delete(route('patients.treatments.destroy', {
            patient: patient.id,
            treatment: treatmentId
        }));
    };
    // Filtered appointments
    const filteredAppointments = appointments.filter(appointment => {
        return (
            (!filters.date || new Date(appointment.date).toISOString().split('T')[0] === filters.date) &&
            (!filters.time || appointment.time === filters.time) &&
            (!filters.status || appointment.status === filters.status)
        );
    });
    const [expandedAppointments, setExpandedAppointments] = useState([]);

    // Toggle function
    const toggleTreatments = (appointmentId) => {
    setExpandedAppointments(prev => 
        prev.includes(appointmentId) 
        ? prev.filter(id => id !== appointmentId)
        : [...prev, appointmentId]
    );
    };

    const togglePayments = (treatmentId) => {
        setExpandedTreatments(prev => 
            prev.includes(treatmentId) 
            ? prev.filter(id => id !== treatmentId)
            : [...prev, treatmentId]
        );
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route("patient.index")}
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                        >
                            <HiArrowLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200 leading-tight">
                            Patient Details
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end flex-1">
                        <div className="flex gap-2">
                            <Link
                                href={route('patient.appointments.create', { patient: patient.id })}
                                className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all min-w-[180px]"
                            >
                                <HiOutlineCalendarDays className="w-4 h-4" />
                                <span>Create Appointment</span>
                            </Link>
                            <Link
                                href={route('patient.edit',{patient:patient.id} )}
                                className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all min-w-[180px]"
                            >
                                <HiPencil className="w-4 h-4" />
                                <span>Edit Patient</span>
                            </Link>
                            <button
                                onClick={deletePatient}
                                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-all min-w-[180px]"
                            >
                                <HiTrash className="w-4 h-4" />
                                <span>Delete Patient</span>
                            </button>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Patient - ${patient.name}`} />

            <div className="py-8 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-8xl mx-auto sm:px-6 lg:px-8"
                >
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-xl">
                        <div className="p-8 space-y-8">
                            {/* Patient Profile Header */}
                            <div className="flex items-center space-x-6">
                                <div className="p-2 border-4 border-indigo-100 dark:border-indigo-900 rounded-full bg-white dark:bg-gray-700">
                                    <HiOutlineUserCircle className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                        {patient.name}
                                    </h1>
                                    <p className="text-lg text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                                        Patient File Number: {patient.file_number}
                                    </p>
                                </div>
                            </div>

                            {/* Patient Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <DetailItem label="Contact Information" value={patient.contact_info} />
                                <DetailItem label="Address" value={patient.address} />
                                <DetailItem label="Age" value={`${patient.age} years`} />
                                <DetailItem label="Gender" value={patient.gender === 'M' ? 'Male' : 'Female'} />
                                <DetailItem 
                                    label="Created At" 
                                    value={new Date(patient.created_at).toLocaleDateString()} 
                                />
                                <DetailItem 
                                    label="Last Updated" 
                                    value={new Date(patient.updated_at).toLocaleDateString()} 
                                />
                            </div>

                            {/* Medical History Section */}
                            {patient.medical_history && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        Medical History
                                    </h3>
                                    <div className="prose dark:prose-invert max-w-none p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        {patient.medical_history}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Dental Chart Section */}
                <div className="space-y-4" id="treatment-section">
                    <div className="p-6 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                        <DentalChart 
                            onToothSelect={(toothNumber) => {
                                setSelectedTooth(toothNumber);
                                localStorage.setItem('selectedTooth', toothNumber);
                            }}
                        />
                        {selectedTooth && (
                            <div className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Selected Tooth: <span className="text-indigo-600 dark:text-indigo-400">{selectedTooth}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Appointments Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-8xl mx-auto sm:px-6 lg:px-8"
                >
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-xl">
                        <div className="p-8 space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                                    Appointments
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                                    <input
                                        type="date"
                                        value={filters.date}
                                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-0 ring-1 ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Filter by date"
                                    />
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-0 ring-1 ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="مجدول">مجدول</option>
                                        <option value="مكتمل">مكتمل</option>
                                        <option value="تم الإلغاء">تم الإلغاء</option>
                                        <option value="لايوجد">لايوجد</option>
                                    </select>
                                    <button
                                        onClick={() => setShowTreatmentForm(true)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg transition-all"
                                    >
                                        <HiMiniPlus className="w-4 h-4" />
                                        <span>Add Treatment</span>
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        {['Date', 'Time', 'Status', 'Notes', 'Actions'].map((header) => (
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
                                        {filteredAppointments.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                    No appointments found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredAppointments.map((appointment) => (
                                                <>
                                                    <tr key={appointment.id} 
                                                        onClick={() => toggleTreatments(appointment.id)}
                                                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <HiCalendar className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-300" />
                                                                <span className="ml-2 text-sm text-gray-800 dark:text-gray-200">
                                                                    {new Date(appointment.date).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <HiClock className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-300" />
                                                                <span className="ml-2 text-sm text-gray-800 dark:text-gray-200">
                                                                    {appointment.time}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[appointment.status]}`}>
                                                                {appointment.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 max-w-xs truncate">
                                                            {appointment.notes || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify space-x-4">
                                                                <Link
                                                                    href={route('patient.appointments.edit', { patient: patient.id, appointment: appointment.id })}
                                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 px-1"
                                                                >
                                                                    <HiPencil className="w-5 h-5" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => deleteAppointment(appointment.id)}
                                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 px-1"
                                                                >
                                                                    <HiTrash className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedTreatment(null);
                                                                        setShowTreatmentForm(true);
                                                                        setSelectedAppointmentId(appointment.id);
                                                                    }}
                                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 px-1"
                                                                >
                                                                    <HiMiniPlus className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    
                                                    {/* Treatments sub-table */}
                                                    {expandedAppointments.includes(appointment.id) && (
                                                        <tr>
                                                            <td colSpan="5" className="px-6 py-4 bg-gray-50 dark:bg-gray-900/20">
                                                                <div className="ml-8">
                                                                    <table className="w-full">
                                                                        <thead>
                                                                            <tr>
                                                                                {['Date', 'Treatment', 'Tooth', 'Status', 'Cost', 'Payment'].map((header) => (
                                                                                    <th 
                                                                                        key={header} 
                                                                                        className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400"
                                                                                    >
                                                                                        {header}
                                                                                    </th>
                                                                                ))}
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {appointment.treatments.map((treatment) => (
                                                                                <tr key={treatment.id} className="hover:bg-gray-100 dark:hover:bg-gray-800/50">
                                                                                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                                                        {new Date(treatment.created_at).toLocaleDateString()}
                                                                                    </td>
                                                                                    <td className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                                                                                        {treatment.name}
                                                                                    </td>
                                                                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                                                                                        {treatment.tooth_number || 'N/A'}
                                                                                    </td>
                                                                                    <td className="px-4 py-2">
                                                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                                                            treatment.status === 'مكتمل' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30' :
                                                                                            treatment.status === 'ملغى' ? 'bg-red-100 text-red-800 dark:bg-red-900/30' :
                                                                                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30'
                                                                                        }`}>
                                                                                            {treatment.status}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                                                                                        ${(Number(treatment.cost) || 0).toFixed(2)}
                                                                                    </td>
                                                                                    <td className="px-4 py-2">
                                                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                                                            treatment.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30' :
                                                                                            treatment.payment_status === 'partially_paid' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30' :
                                                                                            'bg-red-100 text-red-800 dark:bg-red-900/30'
                                                                                        }`}>
                                                                                            {treatment.payment_status}
                                                                                        </span>
                                                                                    </td>
                                                                                    
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </motion.div>
                {/* Recent Treatment section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-8xl mx-auto sm:px-6 lg:px-8"
                >
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-xl">
                        <div className="p-8 space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                                    Recent Treatments
                                </h2>
                                <Link
                                    href={route('patients.treatments.index', { patient: patient.id })}
                                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
                                >
                                    <span>View All Treatments</span>
                                </Link>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            {['Date', 'Treatment', 'Tooth', 'Status', 'Cost', 'Payment', 'Actions'].map((header) => (
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
                                        {treatments.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                    No treatments found
                                                </td>
                                            </tr>
                                        ) : (
                                            treatments.map((treatment) => (
                                                <React.Fragment key={treatment.id}>
                                                    <tr 
                                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                                        onClick={() => togglePayments(treatment.id)}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                            {new Date(treatment.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                            {treatment.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                            {treatment.tooth_number || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                treatment.status === 'مكتمل' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30' :
                                                                treatment.status === 'ملغى' ? 'bg-red-100 text-red-800 dark:bg-red-900/30' :
                                                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30'
                                                            }`}>
                                                                {treatment.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                            ${(Number(treatment.cost) || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                treatment.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30' :
                                                                treatment.payment_status === 'partially_paid' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30' :
                                                                'bg-red-100 text-red-800 dark:bg-red-900/30'
                                                            }`}>
                                                                {treatment.payment_status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center space-x-4">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedTreatment(treatment);
                                                                    }}
                                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                >
                                                                    <HiPencil className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        deleteTreatment(treatment.id);
                                                                    }}
                                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                >
                                                                    <HiTrash className="w-5 h-5" />
                                                                </button>
                                                                {(treatment.payment_status === 'unpaid' || treatment.payment_status === 'partially_paid') && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedTreatment(treatment);
                                                                            setShowPaymentForm(true);
                                                                        }}
                                                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                                    >
                                                                        Add Payment
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                            
                                                    {/* Payments sub-table */}
                                                    {expandedTreatments.includes(treatment.id) && (
                                                        <tr>
                                                            <td colSpan="7" className="px-6 py-4 bg-gray-50 dark:bg-gray-900/20">
                                                                <div className="ml-8">
                                                                    <table className="w-full">
                                                                        <thead>
                                                                            <tr>
                                                                                {['Payment Date', 'Amount', 'Notes'].map((header) => (
                                                                                    <th 
                                                                                        key={header}
                                                                                        className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400"
                                                                                    >
                                                                                        {header}
                                                                                    </th>
                                                                                ))}
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {treatment.payments?.map((payment) => (
                                                                                <tr key={payment.id} className="hover:bg-gray-100 dark:hover:bg-gray-800/50">
                                                                                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                                                        {new Date(payment.payment_date).toLocaleDateString()}
                                                                                    </td>
                                                                                    <td className="px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                                                    ${(Number(payment.amount) || 0).toFixed(2)}
                                                                                    </td>
                                                                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                                                                                        {payment.notes || 'N/A'}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                            {treatment.payments?.length === 0 && (
                                                                                <tr>
                                                                                    <td colSpan="3" className="px-4 py-2 text-center text-gray-500 dark:text-gray-400">
                                                                                        No payments recorded
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </motion.div>
                {(showTreatmentForm || selectedTreatment) && (
                    <TreatmentForm 
                        patient={patient}
                        treatment={selectedTreatment}
                        selectedAppointmentId={selectedAppointmentId}
                        onClose={() => {
                            setShowTreatmentForm(false);
                            setSelectedTreatment(null);
                            setSelectedAppointmentId(null);
                        }}
                    />
                )}

                {showPaymentForm && (
                    <PaymentForm 
                        patient={patient}
                        treatment={selectedTreatment}
                        onClose={() => {
                            setShowPaymentForm(false);
                            setSelectedTreatment(null);
                        }}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}

// DetailItem component with improved contrast
function DetailItem({ label, value }) {
    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <dt className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </dt>
            <dd className="text-gray-900 dark:text-gray-100 font-medium">
                {value || 'N/A'}
            </dd>
        </div>
    );
}