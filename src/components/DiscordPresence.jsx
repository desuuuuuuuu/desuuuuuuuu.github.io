import { useEffect, useState } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { portfolioData } from '../data/portfolio';

const STATUS = {
  online: { color: '#23A55A', label: 'Online' },
  idle: { color: '#F0B232', label: 'Idle' },
  dnd: { color: '#F23F43', label: 'Do Not Disturb' },
  offline: { color: '#80848E', label: 'Offline' }
};

// Live presence via the Lanyard API (https://github.com/Phineas/lanyard).
// Requires the Discord account to be a member of the Lanyard server
// (discord.gg/lanyard); until then it gracefully shows just the profile link.
const DiscordPresence = () => {
  const { userId, username } = portfolioData.discord ?? {};
  const [presence, setPresence] = useState(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const json = await res.json();
        if (!cancelled && json.success) setPresence(json.data);
      } catch {
        // Lanyard unreachable — keep whatever we showed last
      }
    };
    load();
    const timer = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [userId]);

  if (!userId && !username) return null;

  const status = STATUS[presence?.discord_status] ?? STATUS.offline;
  const game = presence?.activities?.find((a) => a.type === 0);
  const custom = presence?.activities?.find((a) => a.type === 4);
  const statusLine = game ? `Playing ${game.name}` : custom?.state || status.label;
  const displayName =
    presence?.discord_user?.global_name || presence?.discord_user?.username || username;

  const card = (
    <>
      <FaDiscord className="text-[#5865F2] text-2xl flex-shrink-0" aria-hidden="true" />
      <div className="min-w-0 text-left">
        <p className="text-light text-sm font-semibold truncate">{displayName}</p>
        <p className="text-muted text-xs flex items-center gap-1.5 truncate">
          <span
            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: status.color }}
            aria-hidden="true"
          />
          {statusLine}
        </p>
      </div>
    </>
  );

  const cardClass =
    'inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-dark-3/90 border border-silver/10 ' +
    'hover:border-silver/30 transition-colors duration-300 max-w-full';

  return userId ? (
    <a
      href={`https://discord.com/users/${userId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClass}
      aria-label={`Discord: ${displayName} — ${statusLine}`}
    >
      {card}
    </a>
  ) : (
    <div className={cardClass}>{card}</div>
  );
};

export default DiscordPresence;
