"use client";

import React from "react";
import { pusherClient } from "@/lib/pusher";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";

interface Member {
  userId: string;
  userImage?: string;
  userName: string;
}

export default function BoardPresence({ boardId }: { boardId: string }) {
  const [members, setMembers] = React.useState<Member[]>([]);
  const { user } = useUser();

  React.useEffect(() => {
    const channel = pusherClient.subscribe(`presence-board-${boardId}`);

    channel.bind("pusher:subscription_succeeded", (members: any) => {
      const initialMembers = Object.values(members.members) as Member[];
      setMembers(initialMembers);
    });

    channel.bind("pusher:member_added", (member: any) => {
      setMembers((current) => [...current, member.info]);
    });

    channel.bind("pusher:member_removed", (member: any) => {
      setMembers((current) =>
        current.filter((m) => m.userId !== member.info.userId)
      );
    });

    // Add current user to presence channel
    if (user) {
      channel.trigger("client-user-joined", {
        userId: user.id,
        userImage: user.imageUrl,
        userName: user.fullName || user.username,
      });
    }

    return () => {
      pusherClient.unsubscribe(`presence-board-${boardId}`);
    };
  }, [boardId, user]);

  return (
    <div className="flex -space-x-2">
      {members.map((member) => (
        <Avatar key={member.userId} className="border-2 border-white w-8 h-8">
          <AvatarImage src={member.userImage} />
          <AvatarFallback>
            {member.userName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}
