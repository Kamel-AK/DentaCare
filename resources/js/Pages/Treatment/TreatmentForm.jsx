import { useForm } from '@inertiajs/react';
import { HiXMark } from 'react-icons/hi2';

const TreatmentForm = ({ patient, selectedTooth, onClose, treatment,selectedAppointmentId }) => {
  const { data, setData, post, put, processing, errors } = useForm({
      patient_id: patient.id,
      appointment_id: treatment?.appointment_id || selectedAppointmentId || null,
      name: treatment?.name || '',
      description: treatment?.description || '',
      tooth_number: treatment?.tooth_number || selectedTooth || '',
      cost: treatment?.cost || 0,
      payment_status: treatment?.payment_status || 'unpaid',
      status: treatment?.status || 'مخطط',
  });

  const submit = (e) => {
      e.preventDefault();
      const method = treatment ? put : post;
      const url = treatment 
      ? route('patients.treatments.update', { 
          patient: patient.id, 
          treatment: treatment.id 
        })
      : route('patients.treatments.store', { patient: patient.id }); 
      method(url, {
          preserveScroll: true,
          onSuccess: () => onClose(),
      });
  };
  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-gray-900/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            {treatment ? 'Edit Treatment Plan' : 'New Treatment Plan'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <HiXMark className="w-7 h-7" />
          </button>
        </div>
        
        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tooth Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Tooth Number
                </label>
                <input
                  type="text"
                  value={data.tooth_number}
                  onChange={e => setData('tooth_number', e.target.value)}
                  placeholder="Enter the number of tooth"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Treatment Status
                </label>
                <select
                  value={data.status}
                  onChange={e => setData('status', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="مخطط">مخطط (Planned)</option>
                  <option value="قيد التنفيذ">قيد التنفيذ (In Progress)</option>
                  <option value="مكتمل">مكتمل (Completed)</option>
                  <option value="ملغى">ملغى (Cancelled)</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
              </div>
            </div>

            {/* Treatment Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Treatment Name *
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="Enter treatment name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Cost
                </label>
                <input
                  type="number"
                  value={data.cost}
                  onChange={e => setData('cost', parseFloat(e.target.value))}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
                {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Payment Status
                </label>
                <select
                  value={data.payment_status}
                  onChange={e => setData('payment_status', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="partially_paid">Partially Paid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Treatment Description
            </label>
            <textarea
              value={data.description}
              onChange={e => setData('description', e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 h-32"
              placeholder="Add detailed treatment notes..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-70"
            >
              {processing ? 'Saving...' : 'Save Treatment Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TreatmentForm;