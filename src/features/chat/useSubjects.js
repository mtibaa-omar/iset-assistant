import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../../services/supabase";
import { chatAPI } from "../../services/api/apiChat";
import { chatKeys } from "./chatKeys";
import { useUser } from "../auth/useUser";

export function useAccessibleSubjectsWithUnread() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const channelName = `subject-sidebar-${user.id}-${Date.now()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "subject_messages",
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: chatKeys.accessibleSubjectsWithUnread(),
          });
        },
      )
      .subscribe((status) => {
        console.log("[Chat] Sidebar subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel).catch(() => {});
    };
  }, [user?.id, queryClient]);

  return useQuery({
    queryKey: chatKeys.accessibleSubjectsWithUnread(),
    queryFn: () => chatAPI.getSubjectsWithUnread(),
    enabled: !!user?.id,
    refetchInterval: 60000, 
  });
}