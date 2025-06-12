import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from "react";
import axios from "axios";
import debounce from 'lodash/debounce';
import TextInput from "@/Components/TextInput";
import { 
  HiMagnifyingGlass, 
  HiOutlineUserCircle, 
  HiTrash, 
  HiPencil,
  HiXCircle 
} from "react-icons/hi2";
import { motion } from 'framer-motion';

export default function Search({ auth }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const debouncedSearch = debounce(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(route('patient.search.query'), {
                query: searchQuery
            });
            setResults(response.data.patients);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    }, 300);

    useEffect(() => {
        debouncedSearch(query);
        return () => debouncedSearch.cancel();
    }, [query]);

    const deletePatient = (patient) => {
        if (!window.confirm(`Delete ${patient.name}?`)) return;
        router.delete(route('patient.destroy', patient.id));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Patient Search
                    </h2>
                    <Link
                        href={route("patient.index")}
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <span>View All Patients</span>
                    </Link>
                </div>
            }
        >
            <Head title="Patient Search" />
            
            <div className="py-8">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-xl">
                        <div className="p-6 space-y-8">
                            {/* Enhanced Search Section */}
                            <div className="relative group">
                                <TextInput
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by name, file number, phone, or email..."
                                    className="w-full pl-14 pr-12 py-4 text-lg rounded-xl border-0 ring-1 ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                                />
                                <HiMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
                                {query && (
                                    <button
                                        onClick={() => setQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
                                    >
                                        <HiXCircle className="w-6 h-6" />
                                    </button>
                                )}
                            </div>

                            {/* Results Section */}
                            {isLoading ? (
                                <div className="space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="h-20 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"
                                        ></motion.div>
                                    ))}
                                </div>
                            ) : results.length > 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid gap-3"
                                >
                                    {results.map(patient => (
                                        <motion.div
                                            key={patient.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center justify-between p-5 bg-white dark:bg-gray-700 rounded-lg shadow-xs hover:shadow-sm transition-shadow duration-200 border border-gray-100 dark:border-gray-600"
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
                                                            <span className="font-medium">File:</span>
                                                            <span className="font-mono text-indigo-600 dark:text-indigo-400">
                                                                #{patient.file_number}
                                                            </span>
                                                        </span>
                                                        <span className="flex items-center space-x-1">
                                                            <span className="font-medium">Age:</span>
                                                            <span>{patient.age}</span>
                                                        </span>
                                                        {patient.contact_info && (
                                                            <span className="truncate">
                                                                {patient.contact_info}
                                                            </span>
                                                        )}
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
                                        {query ? "No matching patients found" : "Enter search terms to find patients"}
                                    </p>
                                    {!query && (
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                            Try name, file number, phone number, or email address
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}