'use client'
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPublic, setIsPublic] = useState(false)


  useEffect(() => {
    const publicPaths = ['/login', '/register'];
    const pathIsPublic = publicPaths.includes(pathname);
    setIsPublic(pathIsPublic)

    if (pathIsPublic) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [pathname, router]);

  return {isPublic};
}
