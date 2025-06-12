import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from '@inertiajs/react';
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import { useEffect, useState } from "react";
import { 
  HiMagnifyingGlass, 
  HiOutlineUserCircle, 
  HiTrash, 
  HiPencil,
  HiXCircle,
  HiArrowUp,
  HiArrowDown
} from "react-icons/hi2";
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';

export default function Index({ auth, patients, queryParams = {}, success }) {
    const [successMessage, setSuccessMessage] = useState(success);
    const [searchQuery, setSearchQuery] = useState(queryParams?.name || '');
    const [isLoading, setIsLoading] = useState(false);

    // Success message timeout
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccessMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Router events for loading state
    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleFinish = () => setIsLoading(false);
        
        // Store the unsubscribe functions
        const startUnsubscribe = router.on('start', handleStart);
        const finishUnsubscribe = router.on('finish', handleFinish);
        
        return () => {
            // Call the unsubscribe functions
            startUnsubscribe();
            finishUnsubscribe();
        };
    }, []);

    // Debounced search
    const debouncedSearch = debounce((query) => {
        const params = { ...queryParams };
        query ? params.name = query : delete params.name;
        router.get(route("patient.index"), params, {
            preserveState: true,
            replace: true
        });
    }, 300);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        debouncedSearch(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery('');
        debouncedSearch('');
    };

    const sortChanged = (field) => {
        const params = { ...queryParams };
        if (field === params.sort_field) {
            params.sort_direction = params.sort_direction === 'asc' ? 'desc' : 'asc';
        } else {
            params.sort_field = field;
            params.sort_direction = 'asc';
        }
        router.get(route("patient.index"), params);
    };

    const deletePatient = (patient) => {
        if (!window.confirm(`Delete ${patient.name}?`)) return;
        router.delete(route('patient.destroy', patient.id));
    };

    const SortIndicator = ({ field }) => {
        if (!queryParams?.sort_field || queryParams.sort_field !== field) return null;
        return queryParams.sort_direction === 'asc' ? (
            <HiArrowUp className="w-4 h-4 ml-1 inline-block" />
        ) : (
            <HiArrowDown className="w-4 h-4 ml-1 inline-block" />
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Patients
                    </h2>
                    <Link
                        href={route("patient.create")}
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <span>Add New Patient</span>
                    </Link>
                </div>
            }
        >
            <Head title="Patients" />
            
            <div className="py-8">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-500 py-3 px-4 text-white rounded-lg mb-6 shadow-md"
                        >
                            {successMessage}
                        </motion.div>
                    )}
                    
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-xl">
                        <div className="p-6 space-y-8">
                            {/* Search and Sorting Controls */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                <div className="relative flex-1 w-full sm:max-w-md">
                                    <TextInput
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        placeholder="Search patients by name..."
                                        className="w-full pl-14 pr-12 py-3 rounded-xl border-0 ring-1 ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                                    />
                                    <HiMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
                                    {searchQuery && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                                        >
                                            <HiXCircle className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-3 items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                                    <div className="flex gap-2">
                                        {['name', 'created_at', 'file_number'].map((field) => (
                                            <button
                                                key={field}
                                                onClick={() => sortChanged(field)}
                                                className={`px-3 py-2 rounded-lg flex items-center ${
                                                    queryParams.sort_field === field
                                                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                            >
                                                {field.replace('_', ' ')}
                                                <SortIndicator field={field} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Patients List */}
                            {isLoading ? (
                                <div className="space-y-3">
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="h-20 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"
                                        ></motion.div>
                                    ))}
                                </div>
                            ) : patients.data.length > 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid gap-3"
                                >
                                    {patients.data.map(patient => (
                                        <motion.div
                                            key={patient.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center justify-between p-5 bg-white dark:bg-gray-700 rounded-lg shadow-xs hover:shadow-sm transition-shadow border border-gray-100 dark:border-gray-600"
                                        >
                                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                                                <HiOutlineUserCircle className="flex-shrink-0 w-9 h-9 text-gray-400 dark:text-gray-300" />
                                                <div className="min-w-0">
                                                    <h3 className="text-lg font-semibold truncate text-gray-800 dark:text-white">
                                                        <Link href={route("patient.show", patient.id)}>
                                                            {patient.name}
                                                        </Link>
                                                    </h3>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                        <span className="flex items-center space-x-1">
                                                            <span className="font-medium">File #:</span>
                                                            <span className="font-mono text-indigo-600 dark:text-indigo-400">
                                                                {patient.file_number}
                                                            </span>
                                                        </span>
                                                        <span className="flex items-center space-x-1">
                                                            <span className="font-medium">Age:</span>
                                                            <span>{patient.age}</span>
                                                        </span>
                                                        <span className="flex items-center space-x-1">
                                                            <span className="font-medium">Created:</span>
                                                            <span>{new Date(patient.created_at).toLocaleDateString()}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 ml-4">
                                                <Link
                                                    href={route('patient.edit', patient.id)}
                                                    className="flex items-center space-x-2 px-3.5 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-100 dark:border-indigo-800"
                                                >
                                                    <HiPencil className="w-4 h-4" />
                                                    <span className="text-sm">Edit</span>
                                                </Link>
                                                <button
                                                    onClick={() => deletePatient(patient)}
                                                    className="flex items-center space-x-2 px-3.5 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors border border-red-100 dark:border-red-800"
                                                >
                                                    <HiTrash className="w-4 h-4" />
                                                    <span className="text-sm">Delete</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 space-y-4"
                                >
                                    <div className="mx-auto w-24 h-24 text-gray-200 dark:text-gray-600">
                                        <HiOutlineUserCircle className="w-full h-full" />
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                                        No patients found
                                    </p>
                                </motion.div>
                            )}

                            {/* Pagination */}
                            {patients.data.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <Pagination 
                                        links={patients.meta.links} 
                                        className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6"
                                    />
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}