'use client';

import Link from 'next/link';
import { UserProfile } from '@/types/profile';
import ProfileAvatar from './ProfileAvatar';

interface ProfileDisplayProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  privacySettings?: {
    showEmail: boolean;
    showMajor: boolean;
    showYear: boolean;
    showBio: boolean;
  };
}

export default function ProfileDisplay({ 
  profile, 
  isOwnProfile = false,
  privacySettings = {
    showEmail: true,
    showMajor: true,
    showYear: true,
    showBio: true
  }
}: ProfileDisplayProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-[#D22030] px-4 py-5 sm:px-6">
        <div className="flex items-center space-x-4">
          <ProfileAvatar
            imageUrl={profile.photoUrl}
            name={profile.name}
            size="lg"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">
              {profile.name}
            </h1>
            {isOwnProfile && (
              <Link
                href="/profile/edit"
                className="inline-block mt-2 text-white hover:text-gray-200 text-sm underline"
              >
                Edit Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6 space-y-4">
        {privacySettings.showEmail && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
          </div>
        )}

        {privacySettings.showMajor && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Major</h3>
            <p className="mt-1 text-sm text-gray-900">{profile.major}</p>
          </div>
        )}

        {privacySettings.showYear && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Year</h3>
            <p className="mt-1 text-sm text-gray-900">{profile.year}</p>
          </div>
        )}

        {privacySettings.showBio && profile.bio && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Bio</h3>
            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
              {profile.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}