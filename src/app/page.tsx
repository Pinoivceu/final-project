"use client"
import dynamic from 'next/dynamic';

export default function Home() {

  const MapView = dynamic(() => import('@/components/map'), {
    ssr: false,
    loading: () => <p>Loading Map...</p>
  })

  return (
    <main>
      <h1>Owner Dashboard</h1>
      <div >
        <MapView />
      </div>
    </main>
  );
}
