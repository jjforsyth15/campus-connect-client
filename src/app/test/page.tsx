'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Log the env var
    console.log('API URL from env:', process.env.NEXT_PUBLIC_API_URL);
    
    // Test connection
    api.get('/')
      .then(response => {
        console.log(' Success:', response.data);
        setResult(response.data);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <div className="mb-4">
        <strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}
      </div>
      
      {result && (
        <div className="bg-green-100 p-4 rounded">
          <strong>Connected:</strong>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 p-4 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}