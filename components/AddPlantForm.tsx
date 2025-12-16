"use client";

import { useRef } from "react";

interface AddPlantFormProps {
  serverAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}

export default function AddPlantForm({ serverAction }: AddPlantFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    const result = await serverAction(formData);

    if (result.success) {
      formRef.current?.reset();
    }
  };

  return (
    <div className="mb-8 p-6 border border-gray-700 rounded-lg bg-gray-900">
      <h2 className="text-2xl font-semibold mb-4">Add a New Plant</h2>
      <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="plantName" className="block mb-2 text-sm font-medium">
            Plant Name
          </label>
          <input
            type="text"
            id="plantName"
            name="name"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:border-gray-500"
            placeholder="e.g., Aloe Vera"
            required
          />
        </div>

        <div>
          <label htmlFor="plantFeeling" className="block mb-2 text-sm font-medium">
            Feeling
          </label>
          <input
            type="text"
            id="plantFeeling"
            name="feeling"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:border-gray-500"
            placeholder="e.g., Relaxed"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Add Plant
        </button>
      </form>
    </div>
  );
}
