'use client';

import { useEffect, useState } from 'react';

export const useHash = () => {
  const [hash, setHash] = useState('');

  useEffect(() => {
    const updateHash = () => {
      const newHash = window.location.hash.replace(/^#/, '');
      setHash(newHash);
    };

    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  return hash;
};
