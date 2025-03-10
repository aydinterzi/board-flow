import React from "react";
import Link from "next/link";
import db from "@/db";
import { boards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import CreateBoardDialog from "./CreateBoardDialog";

async function BoardsSidebar() {
  const { userId } = await auth();
  const userBoards = await db
    .select()
    .from(boards)
    .where(eq(boards.userId, userId!));

  return (
    <div className="w-64 h-full bg-gray-50 border-r border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Boards</h2>
        <CreateBoardDialog />
      </div>
      <div className="space-y-1">
        {userBoards.map((board) => (
          <Link
            key={board.id}
            href={`/dashboard/boards/${board.id}`}
            className="block p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {board.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BoardsSidebar;
