import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  HiOutlineUserGroup, 
  HiCalendarDays, 
  HiCurrencyDollar,
  HiExclamationTriangle,
  HiUserCircle,
  HiArrowRight,
  HiArrowTrendingUp
} from "react-icons/hi2";
import { useState } from "react";

// Metric config for DRYness
const METRICS = [
  {
    icon: <HiOutlineUserGroup className="w-8 h-8 text-indigo-600" />,
    title: "Total Patients",
    key: "totalPatients",
    trend: "12%",
    link: "patient.index"
  },
  {
    icon: <HiCalendarDays className="w-8 h-8 text-emerald-600" />,
    title: "Today's Appointments",
    key: "appointmentsToday",
    trend: "-3%",
    link: "appointments.index"
  },
  {
    icon: <HiExclamationTriangle className="w-8 h-8 text-rose-600" />,
    title: "Pending Treatments",
    key: "unpaidTreatments",
    trend: "5%",
    link: null
  },
  {
    icon: <HiCurrencyDollar className="w-8 h-8 text-amber-600" />,
    title: "Monthly Revenue",
    key: "paymentsThisMonth",
    trend: "18%",
    link: null,
    isCurrency: true
  }
];

const TABS = [
  { label: "Upcoming", value: "appointments" },
  { label: "Treatments", value: "treatments" },
  { label: "Payments", value: "payments" }
];

export default function Dashboard({ auth, stats = {}, recent = {} }) {
  const isLoading = !stats || Object.keys(stats).length === 0;
  const [tab, setTab] = useState("appointments");

  // Activity data for tabs
  const activityData = {
    appointments: {
      items: recent.appointments,
      icon: <HiCalendarDays className="w-6 h-6 text-indigo-500" />,
      empty: "No upcoming appointments",
      render: item => (
        <div className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition">
          <HiUserCircle className="w-8 h-8 text-gray-400" />
          <div className="flex-1">
            <div className="font-semibold">{item.patient?.name || 'Unknown'}</div>
            <div className="text-sm text-gray-500">
              {new Date(item.date).toLocaleDateString()} • {item.time}
            </div>
          </div>
          <HiArrowTrendingUp className={`w-5 h-5 ${getStatusColor(item.status)}`} />
        </div>
      )
    },
    treatments: {
      items: recent.treatments,
      icon: <HiExclamationTriangle className="w-6 h-6 text-rose-500" />,
      empty: "No recent treatments",
      render: item => (
        <div className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition">
          <div className="flex-1">
            <div className="font-semibold flex items-center gap-2">
              <HiCurrencyDollar className="w-5 h-5 text-amber-500" />
              {item.name}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {item.patient?.name || 'Unknown'} • {item.status}
            </div>
          </div>
          <span className={`text-sm font-bold ${getPaymentStatusColor(item.payment_status)}`}>
            ${item.cost}
          </span>
        </div>
      )
    },
    payments: {
      items: recent.payments,
      icon: <HiCurrencyDollar className="w-6 h-6 text-emerald-500" />,
      empty: "No recent payments",
      render: item => (
        <div className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition">
          <HiUserCircle className="w-8 h-8 text-gray-400" />
          <div className="flex-1">
            <div className="font-semibold">${item.amount.toFixed(2)}</div>
            <div className="text-sm text-gray-500">
              {item.patient?.name || 'Unknown'} • {new Date(item.payment_date).toLocaleDateString()}
            </div>
          </div>
          <HiArrowTrendingUp className="w-5 h-5 text-emerald-500" />
        </div>
      )
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            🏥 Clinic Overview
          </h2>
          <Link 
            href={route('patient.create')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg shadow-lg hover:from-indigo-700 transition-all font-semibold text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <HiOutlineUserGroup className="w-6 h-6" />
            Add New Patient
          </Link>
        </div>
      }
    >
      <Head title="Dashboard" />

      <div className="py-6 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <svg className="animate-spin h-8 w-8 text-indigo-400 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard data…</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Metrics Grid */}
            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
              {METRICS.map((metric, idx) => (
                <MetricCard
                  key={metric.title}
                  icon={metric.icon}
                  title={metric.title}
                  value={
                    metric.isCurrency
                      ? `$${(stats[metric.key] || 0).toLocaleString()}`
                      : stats[metric.key] ?? '--'
                  }
                  trend={metric.trend}
                  link={metric.link ? route(metric.link) : null}
                />
              ))}
            </div>

            {/* Activity Tabs & Feed */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Activity Feed
                  </span>
                  {activityData[tab].icon}
                </div>
                <div className="flex gap-2">
                  {TABS.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setTab(t.value)}
                      className={`px-4 py-2 rounded-md font-medium transition
                        ${tab === t.value
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {activityData[tab].items?.length === 0 ? (
                  <div className="flex flex-col items-center py-14 text-gray-400 select-none">
                    <svg width="64" height="64" className="mb-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeOpacity="0.2" fill="none"/>
                      <path d="M22 32h20M32 22v20" stroke="currentColor" strokeLinecap="round"/>
                    </svg>
                    <span className="text-base">{activityData[tab].empty}</span>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {activityData[tab].items.map((item, idx) => (
                      <div key={idx}>
                        {activityData[tab].render(item)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}

function MetricCard({ icon, title, value, trend, link }) {
  return (
    <motion.div 
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow group transition-all relative"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-3 rounded-full bg-gradient-to-tr from-indigo-50 to-white dark:from-indigo-900 dark:to-gray-800">
          {icon}
        </div>
        <span className="text-md font-medium text-gray-500 dark:text-gray-400">{title}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">{value}</div>
        {link && (
          <Link href={link}
            className="rounded-full p-2 hover:bg-indigo-100 dark:hover:bg-gray-700 transition"
            aria-label={`Go to ${title}`}
          >
            <HiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition" />
          </Link>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <HiArrowTrendingUp className={`w-4 h-4 ${trend.startsWith('-') ? 'text-rose-500' : 'text-emerald-500'}`} />
          <span className={trend.startsWith('-') ? 'text-rose-600' : 'text-emerald-600'}>
            {trend} from last month
          </span>
        </div>
      )}
    </motion.div>
  );
}

// --- Helper functions ---
function getStatusColor(status) {
  const colors = {
    'مجدول': 'text-indigo-500',
    'مكتمل': 'text-emerald-500',
    'تم الإلغاء': 'text-rose-500',
    'لايوجد': 'text-gray-400'
  };
  return colors[status] || 'text-gray-400';
}
function getPaymentStatusColor(status) {
  const colors = {
    'paid': 'text-emerald-600',
    'partially_paid': 'text-amber-600',
    'unpaid': 'text-rose-600'
  };
  return colors[status] || 'text-gray-600';
}