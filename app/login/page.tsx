// app/login/page.js
// This is the new page entry point for the /login route.
// It's a Server Component that wraps our client-side AuthForm in a Suspense boundary.

import { Suspense } from 'react';
import AuthForm from './AuthForm';

export default function LoginPage() {
  return (
    // The Suspense boundary is crucial for the build process.
    // It tells Next.js to show a fallback UI while the client-side
    // component (which uses useSearchParams) is loading.
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}