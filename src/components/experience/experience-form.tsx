'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ExperienceFormProps {
  initialData?: {
    id?: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  };
}

export default function ExperienceForm({ initialData }: ExperienceFormProps) {
  const [isEditing, setIsEditing] = useState(!initialData);
  const [formData, setFormData] = useState(initialData || {
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/experience', {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.refresh();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        const response = await fetch('/api/experience', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: initialData?.id }),
        });

        if (response.ok) {
          router.refresh();
        }
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
  };

  if (!isEditing && initialData) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Company</h3>
          <p className="mt-1">{initialData.company}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Position</h3>
          <p className="mt-1">{initialData.position}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Duration</h3>
          <p className="mt-1">
            {new Date(initialData.startDate).toLocaleDateString()} -{' '}
            {initialData.current ? 'Present' : new Date(initialData.endDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Description</h3>
          <p className="mt-1">{initialData.description}</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Company
        </label>
        <input
          type="text"
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Position
        </label>
        <input
          type="text"
          id="position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={formData.current}
          />
        </div>
      </div>
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.current}
            onChange={(e) => {
              setFormData({
                ...formData,
                current: e.target.checked,
                endDate: e.target.checked ? '' : formData.endDate
              });
            }}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">I currently work here</span>
        </label>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Save
        </button>
        {initialData && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
} 