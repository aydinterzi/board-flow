import React from "react";
import { boards, boardMembers } from "@/db/schema";
import db from "@/db";
import { eq, and } from "drizzle-orm";
import Board from "@/components/Board";
import { notFound, redirect } from "next/navigation";
import BoardPresence from "@/components/BoardPresence";
import { auth } from "@clerk/nextjs/server";
import BoardMembers from "@/components/BoardMembers";

export default async function BoardPage({
  params,
}: {
  params: { boardId: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Check if user is a board member
  const member = await db
    .select()
    .from(boardMembers)
    .where(
      and(
        eq(boardMembers.boardId, params.boardId),
        eq(boardMembers.userId, userId)
      )
    )
    .then((rows) => rows[0]);

  if (!member) {
    redirect("/dashboard"); // or show "no access" page
  }

  const board = await db
    .select()
    .from(boards)
    .where(eq(boards.id, params.boardId))
    .then((res) => res[0]);

  if (!board) {
    notFound();
  }

  return (
    <div>
      <div className="flex justify-between items-center p-6 pb-0">
        <h1 className="text-2xl font-semibold">{board.title}</h1>
        <div className="flex items-center gap-4">
          <BoardPresence boardId={params.boardId} />
          <div className="flex gap-2">
            {member.role === "owner" && (
              <BoardMembers boardId={params.boardId} />
            )}
          </div>
        </div>
      </div>
      <Board boardId={params.boardId} />
    </div>
  );
}
