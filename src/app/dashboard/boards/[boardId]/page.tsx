import React from "react";
import { boards } from "@/db/schema";
import db from "@/db";
import { eq } from "drizzle-orm";
import Board from "@/components/Board";
import { notFound } from "next/navigation";

export default async function BoardPage({
  params,
}: {
  params: { boardId: string };
}) {
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
        <div className="flex gap-2">{/* Add board actions here */}</div>
      </div>
      <Board boardId={params.boardId} />
    </div>
  );
}
