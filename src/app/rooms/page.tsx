import React, { Suspense } from 'react';
import RoomsGridContent from './RoomGridContent';

function RoomsPage() {
  return (
    <Suspense fallback={<div>Loading rooms...</div>}>
          <RoomsGridContent />
        </Suspense>
  );
}
export default RoomsPage;