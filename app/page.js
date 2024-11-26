'use client';
import dynamic from 'next/dynamic'

const CharacterPlane = dynamic(() => import('./components/CharacterPlane'), {
  ssr: false,
});

export default function Home() {
  return (
    <main style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
      <CharacterPlane />
    </main>
  );
}