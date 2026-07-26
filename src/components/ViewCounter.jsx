import { useEffect, useState } from 'react';
import { FaRegEye } from 'react-icons/fa';

const HIT_URL = 'https://abacus.jasoncameron.dev/hit/desuuuuuuuu-github-io/views';
const GET_URL = 'https://abacus.jasoncameron.dev/get/desuuuuuuuu-github-io/views';
const SESSION_KEY = 'view-counted';

// Global visit counter backed by Abacus (free, no-signup hit counter).
// Counts once per browser session; renders nothing if the API is unreachable.
const ViewCounter = () => {
  const [views, setViews] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const alreadyCounted = (() => {
      try {
        return sessionStorage.getItem(SESSION_KEY) === '1';
      } catch {
        return false;
      }
    })();

    fetch(alreadyCounted ? GET_URL : HIT_URL)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || typeof json.value !== 'number') return;
        setViews(json.value);
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
          // session storage unavailable — worst case we count refreshes too
        }
      })
      .catch(() => {
        // counter service unreachable — stay hidden
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (views === null) return null;

  return (
    <span className="flex items-center gap-1.5 text-muted text-[11px]" title="Total site visits">
      <FaRegEye size={12} aria-hidden="true" />
      {views.toLocaleString()} views
    </span>
  );
};

export default ViewCounter;
