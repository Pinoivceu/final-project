"use client"
import dynamic from 'next/dynamic';

export default function Home() {

  const MapView = dynamic(() => import('@/components/map'), {
    ssr: false,
    loading: () => <p>Loading Map...</p>
  })

  return (
    <main>
      <div >
        <MapView />
      </div>
    </main>
  );
}
