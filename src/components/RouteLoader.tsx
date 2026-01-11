"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GlobalLoader from "./GlobalLoader";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 400); // smooth, no flicker

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return <GlobalLoader />;
}
