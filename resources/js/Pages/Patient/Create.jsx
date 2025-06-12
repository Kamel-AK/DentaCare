import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth }){
    const { data, setData, post, errors, reset } = useForm({
        name: "",
        contact_info:"",
        address: "",
        age:  "",
        gender:  "",
        medical_history: "",
        file_number:"",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("patient.store"));
    };
    
    return (
        <AuthenticatedLayout
          user={auth.user}
          header={
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                Create New Patient
              </h2>
            </div>
          }
        >
          <Head title="patients" />
    
          <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <form
                  onSubmit={onSubmit}
                  className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                >
                  <div className="mt-4">
                    <InputLabel htmlFor="patient_name" value="patient Name" />
    
                    <TextInput
                      id="patient_name"
                      type="text"
                      name="name"
                      value={data.name}
                      className="mt-1 block w-full"
                      isFocused={true}
                      onChange={(e) => setData("name", e.target.value)}
                    />
    
                    <InputError message={errors.name} className="mt-2" />
                  </div>
                  <div className="mt-4">
                    <InputLabel htmlFor="patient_contact_info" value="patient Contact Info" />
    
                    <TextInput
                      id="patient_contact_info"
                      type="text"
                      name="contact_info"
                      value={data.contact_info}
                      className="mt-1 block w-full"
                      isFocused={true}
                      onChange={(e) => setData("contact_info", e.target.value)}
                    />
    
                    <InputError message={errors.contact_info} className="mt-2" />
                  </div>
                  <div className="mt-4">
                    <InputLabel htmlFor="patient_address" value="patient address" />
    
                    <TextInput
                      id="patient_address"
                      type="text"
                      name="address"
                      value={data.address}
                      className="mt-1 block w-full"
                      isFocused={true}
                      onChange={(e) => setData("address", e.target.value)}
                    />
    
                    <InputError message={errors.address} className="mt-2" />
                  </div>
                  <div className="mt-4">
                    <InputLabel htmlFor="patient_age" value="patient age" />
    
                    <TextInput
                      id="patient_age"
                      type="text"
                      name="age"
                      value={data.age}
                      className="mt-1 block w-full"
                      isFocused={true}
                      onChange={(e) => setData("age", e.target.value)}
                    />
    
                    <InputError message={errors.age} className="mt-2" />
                  </div>
                  <div className="mt-4">
                    <InputLabel htmlFor="patient_gender" value="patient gender" />
    
                    <SelectInput
                      name="gender"
                      id="patient_gender"
                      className="mt-1 block w-full"
                      value={data.gender}
                      onChange={(e) => setData("gender", e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">female</option>
                    </SelectInput>
    
                    <InputError message={errors.gender} className="mt-2" />
                  </div>
                  <div className="mt-4">
                    <InputLabel
                      htmlFor="patient_medical_history"
                      value="patient medical history"
                    />
    
                    <TextAreaInput
                      id="patient_medical_history"
                      name="medical_history"
                      value={data.medical_history}
                      className="mt-1 block w-full"
                      onChange={(e) => setData("medical_history", e.target.value)}
                    />
    
                    <InputError message={errors.medical_history} className="mt-2" />
                  </div>
                  <div className="mt-4">
                    <InputLabel htmlFor="patient_file_number" value="patient File Number" />
    
                    <TextInput
                      id="patient_file_number"
                      type="text"
                      name="file_number"
                      value={data.file_number}
                      className="mt-1 block w-full"
                      isFocused={true}
                      onChange={(e) => setData("file_number", e.target.value)}
                    />
    
                    <InputError message={errors.file_number} className="mt-2" />
                  </div>
                  <div className="mt-4 text-right">
                    <Link
                      href={route("patient.index")}
                      className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                    >
                      Cancel
                    </Link>
                    <button className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </AuthenticatedLayout>
      );
}