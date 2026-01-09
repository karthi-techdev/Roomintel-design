import { Suspense } from 'react';
import RoomsGridContent from './RoomGridContent';

export default function RoomsPage() {
  return (
    <Suspense fallback={<div>Loading rooms...</div>}>
      <RoomsGridContent />
    </Suspense>
  );
}