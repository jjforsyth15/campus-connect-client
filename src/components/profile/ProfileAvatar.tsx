'use client';

import Image from 'next/image';

interface ProfileAvatarProps {
  imageUrl?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProfileAvatar({
  imageUrl,
  name,
  size = 'md',
  className = '',
}: ProfileAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-24 h-24 text-3xl',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (imageUrl) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="rounded-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${className} bg-[#D22030] text-white rounded-full flex items-center justify-center font-semibold`}
    >
      {initials}
    </div>
  );
}