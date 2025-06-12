import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from '@inertiajs/react';
import { useState } from "react";
import { 
  HiChevronLeft,
  HiChevronRight,
  HiPencil,
  HiXMark 
} from "react-icons/hi2";
import { motion } from 'framer-motion';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parseISO, 
  isValid 
} from 'date-fns';

const parseDateSafely = (dateString) => {
  if (!dateString) return null;
  try {
    const parsed = dateString.includes('T') 
      ? parseISO(dateString)
      : new Date(`${dateString}T00:00:00`);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const parseTimeSafely = (timeString) => {
    if (!timeString) return null;
    try {
      const fullTime = timeString.includes('T') 
        ? timeString
        : `2000-01-01T${timeString}`;
      const parsed = parseISO(fullTime);
      return isValid(parsed) ? parsed : null;
    } catch {
      return null;
    }
};
  
export default function Index({ auth, appointments }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDayAppointments, setSelectedDayAppointments] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const appointmentsByDate = appointments.data.reduce((acc, appointment) => {
        const parsedDate = parseDateSafely(appointment.date);
        if (parsedDate) {
            const dateKey = format(parsedDate, 'yyyy-MM-dd');
            acc[dateKey] = acc[dateKey] || [];
            acc[dateKey].push(appointment);
        }
        return acc;
    }, {});

    const statusColors = {
        'مجدول': 'bg-indigo-100 text-indigo-800',
        'مكتمل': 'bg-emerald-100 text-emerald-800',
        'تم الإلغاء': 'bg-red-100 text-red-800',
        'لايوجد': 'bg-gray-100 text-gray-800'
    };

    const changeMonth = (offset) => {
        setCurrentDate(new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + offset,
            1
        ));
    };

    const handleDayClick = (day) => {
        const dayKey = format(day, 'yyyy-MM-dd');
        const appointments = appointmentsByDate[dayKey] || [];
        if (appointments.length > 0) {
            setSelectedDayAppointments(appointments);
            setIsModalOpen(true);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Appointment Calendar
                    </h2>
                </div>
            }
        >
            <Head title="Appointment Calendar" />
            
            {/* Popup Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold dark:text-white">
                                    {format(parseDateSafely(selectedDayAppointments[0]?.date), 'EEEE, MMM d')}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                    <HiXMark className="w-5 h-5" /> {/* Changed here */}
                                </button>
                            </div>

                            <div className="space-y-3">
                                {selectedDayAppointments.map(appointment => {
                                    const parsedTime = parseTimeSafely(appointment.time);
                                    const timeDisplay = parsedTime ? format(parsedTime, 'h:mm a') : 'N/A';
                                    
                                    return (
                                        <div
                                            key={appointment.id}
                                            className={`p-3 rounded-md ${statusColors[appointment.status]}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate dark:text-gray-900">
                                                        {appointment.patient?.name || 'Unknown Patient'}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                                        {timeDisplay} - {appointment.status}
                                                    </div>
                                                </div>
                                                <Link
                                                    href={route('patient.appointments.edit', {
                                                        patient: appointment.patient.id,
                                                        appointment: appointment.id
                                                    })}
                                                    className="ml-2 opacity-70 hover:opacity-100 dark:text-gray-900"
                                                >
                                                    <HiPencil className="w-4 h-4" />
                                                </Link>
                                            </div>
                                            {appointment.notes && (
                                                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                                                    {appointment.notes}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Calendar Section */}
            <div className="py-8">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-xl">
                        <div className="p-6 space-y-8">
                            {/* Month Navigation */}
                            <div className="flex items-center justify-between px-4">
                                <button
                                    onClick={() => changeMonth(-1)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
                                >
                                    <HiChevronLeft className="w-6 h-6" />
                                </button>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    {format(currentDate, 'MMMM yyyy')}
                                </h3>
                                <button
                                    onClick={() => changeMonth(1)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
                                >
                                    <HiChevronRight className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2 bg-gray-50 dark:bg-gray-900 p-4">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div 
                                        key={day} 
                                        className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center border border-gray-100 dark:border-gray-700"
                                    >
                                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                            {day}
                                        </span>
                                    </div>
                                ))}
                                
                                {daysInMonth.map((day, index) => {
                                    const dayKey = format(day, 'yyyy-MM-dd');
                                    const dayAppointments = appointmentsByDate[dayKey] || [];
                                    const isToday = isSameDay(day, new Date());
                                    const hasAppointments = dayAppointments.length > 0;

                                    return (
                                        <motion.div
                                            key={index}
                                            className={`group relative min-h-[150px] p-3 rounded-xl transition-all
                                                ${isSameMonth(day, currentDate) ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-900/50'}
                                                ${isToday ? 'ring-2 ring-indigo-500' : ''}
                                                border border-gray-100 dark:border-gray-700
                                                ${hasAppointments ? 'hover:border-indigo-200 dark:hover:border-indigo-900 cursor-pointer' : ''}`}
                                            whileHover={{ scale: hasAppointments ? 1.02 : 1 }}
                                            onClick={() => hasAppointments && handleDayClick(day)}
                                        >
                                            <div className={`flex items-center justify-between mb-2 ${
                                                isSameMonth(day, currentDate) 
                                                    ? 'text-gray-800 dark:text-gray-200' 
                                                    : 'text-gray-400 dark:text-gray-600'
                                            }`}>
                                                <span className="font-medium">{format(day, 'd')}</span>
                                                {isToday && (
                                                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                                )}
                                            </div>
                                            
                                            {dayAppointments.length === 0 ? (
                                                <div className="text-center absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xs text-gray-400 dark:text-gray-600">
                                                        لايوجد مواعيد
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {dayAppointments.slice(0, 2).map(appointment => {
                                                        const parsedTime = parseTimeSafely(appointment.time);
                                                        const timeDisplay = parsedTime ? format(parsedTime, 'h:mm a') : 'N/A';
                                                        
                                                        return (
                                                            <motion.div
                                                                key={appointment.id}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className={`p-2 rounded-md text-sm shadow-xs 
                                                                    ${statusColors[appointment.status]} 
                                                                    hover:shadow-sm transition-shadow`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="font-medium truncate dark:text-gray-900">
                                                                            {appointment.patient?.name || 'Unknown Patient'}
                                                                        </div>
                                                                        <div className="text-xs opacity-75 dark:text-gray-700">
                                                                            {timeDisplay}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                    {dayAppointments.length > 2 && (
                                                        <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                                                            +{dayAppointments.length - 2} more appointments
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}