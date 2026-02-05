'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProfileFormData {
  name: string;
  major: string;
  year: string;
  bio: string;
  photo?: File;
}

export default function ProfileForm({ 
  initialData,
  onSubmit 
}: { 
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => Promise<void>;
}) {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: initialData?.name || '',
    major: initialData?.major || '',
    year: initialData?.year || '',
    bio: initialData?.bio || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#D22030] focus:ring-[#D22030]"
          required
        />
      </div>

      <div>
        <label htmlFor="major" className="block text-sm font-medium text-gray-700">
          Major
        </label>
        <input
          type="text"
          id="major"
          value={formData.major}
          onChange={(e) => setFormData({ ...formData, major: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#D22030] focus:ring-[#D22030]"
          required
        />
      </div>

      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
          Year
        </label>
        <select
          id="year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#D22030] focus:ring-[#D22030]"
          required
        >
          <option value="">Select Year</option>
          <option value="Freshman">Freshman</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
          <option value="Graduate">Graduate</option>
        </select>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#D22030] focus:ring-[#D22030]"
        />
      </div>

      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
          Profile Photo
        </label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData({ ...formData, photo: file });
            }
          }}
          className="mt-1 block w-full"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#D22030] text-white px-4 py-2 rounded-md hover:bg-[#B41B28] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D22030] disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}