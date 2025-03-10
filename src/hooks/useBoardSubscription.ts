"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";

export function useBoardSubscription(boardId: string) {
  const router = useRouter();

  useEffect(() => {
    const channel = pusherClient.subscribe(`board-${boardId}`);

    channel.bind("board-update", () => {
      router.refresh();
    });

    return () => {
      pusherClient.unsubscribe(`board-${boardId}`);
    };
  }, [boardId, router]);
}
