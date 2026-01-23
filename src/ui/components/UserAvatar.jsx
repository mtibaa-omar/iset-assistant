import React from 'react'

export default function UserAvatar({ collapsed }) {
  return (
    <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
          <img className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt="Logo" src="/image.png" />
          {!collapsed && (
            <div className="whitespace-nowrap overflow-hidden">
              <h3 className="text-base font-semibold text-slate-800 dark:text-white truncate">
                ISET Assistant
              </h3>
              <h4 className="text-xs font-medium text-slate-500 dark:text-white/60">
                Mtibaa Omar
              </h4>
            </div>
          )}
        </div>
  )
}
