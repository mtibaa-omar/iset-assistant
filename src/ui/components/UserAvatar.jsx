import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../features/auth/useUser';

export default function UserAvatar({ collapsed }) {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleClick = () => {
    navigate('/account');
  };
  const avatarUrl = user?.profile_avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.avatar || "/image.png";
  const displayName = user?.profile_full_name || user?.user_metadata?.full_name || "ISET Assistant";
  const handleImageError = (e) => {
    console.error('Avatar failed to load:', e.target.src);
    e.target.src = '/image.png';
  };

  return (
    <div 
      className={`flex items-center gap-3 cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg py-2 ${collapsed ? "justify-center w-full -mb-6" : "w-full lg:-mb-6 -mb-2"}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <img 
        className={`flex-shrink-0 object-cover rounded-full ${collapsed ? "w-12 h-12" : "w-12 h-12"}`} 
        alt={displayName} 
        src={avatarUrl}
        onError={handleImageError}
        referrerPolicy="no-referrer"
      />
      {!collapsed && (
        <div className="overflow-hidden whitespace-nowrap">
          <h3 className="text-base font-semibold truncate text-slate-800 dark:text-white">
            {displayName}
          </h3>
          <h4 className="text-xs font-medium text-slate-500 dark:text-white/60">
            {user?.profile_role ? user.profile_role.charAt(0).toUpperCase() + user.profile_role.slice(1) : 'Student'}
          </h4>
        </div>
      )}
    </div>
  );
}
