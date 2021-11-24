import { useEffect, useState } from 'react';

const macIDs = ['mechc2', 'thompd10', 'willim36', 'alkoasma', 'mahajanh'];

// Required to do this asynchronously on the client
// so there isn't a client/server mismatch during hydration
export default function useRandomMacID() {
  const [macID, setMacID] = useState('');

  useEffect(() => {
    setMacID(macIDs[Math.floor(Math.random() * macIDs.length)]);
  }, []);

  return macID;
}
