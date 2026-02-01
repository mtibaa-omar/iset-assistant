import { useQuery } from "@tanstack/react-query";
import { chatAPI } from "../../services/api/apiChat";
import { chatKeys } from "./chatKeys";


export function useAccessibleSubjectsWithUnread() {
  return useQuery({
    queryKey: chatKeys.accessibleSubjectsWithUnread(),
    queryFn: () => chatAPI.getSubjectsWithUnread(),
    refetchInterval: 60000, // Refetch every minute for unread counts
  });
}