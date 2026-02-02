import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../features/auth/useUser';

export default function UserAvatar({ collapsed }) {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleClick = () => {
    navigate('/account');
  };

  return (
    <div 
      className={`flex items-center gap-3 cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg py-2 ${collapsed ? "justify-center w-full -mb-6" : "w-full -mb-6 "}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <img 
        className={`flex-shrink-0 object-cover rounded-full ${collapsed ? "w-12 h-12" : "w-12 h-12"}`} 
        alt={user?.user_metadata?.full_name || "User"} 
        src={user?.user_metadata?.avatar || user?.user_metadata?.avatar_url || "/image.png"} 
      />
      {!collapsed && (
        <div className="overflow-hidden whitespace-nowrap">
          <h3 className="text-base font-semibold truncate text-slate-800 dark:text-white">
            {user?.user_metadata?.full_name || "ISET Assistant"}
          </h3>
          <h4 className="text-xs font-medium text-slate-500 dark:text-white/60">
            {user.profile_role.charAt(0).toUpperCase() + user.profile_role.slice(1)}
          </h4>
        </div>
      )}
    </div>
  );
}
