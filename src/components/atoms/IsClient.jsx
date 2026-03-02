"use client";

import { useEffect, useState } from "react";

export default function IsClient({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // or a loader placeholder
  return <>{children}</>;
}
