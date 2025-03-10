import React from "react";
import { lists, cards } from "@/db/schema";
import db from "@/db";
import { eq } from "drizzle-orm";
import CreateListForm from "./CreateListForm";
import DraggableBoard from "./DraggableBoard";

interface BoardProps {
  boardId: string;
}

async function Board({ boardId }: BoardProps) {
  const boardLists = await db
    .select()
    .from(lists)
    .where(eq(lists.boardId, boardId))
    .orderBy(lists.position);

  const listsWithCards = await Promise.all(
    boardLists.map(async (list) => {
      const listCards = await db
        .select()
        .from(cards)
        .where(eq(cards.listId, list.id))
        .orderBy(cards.position);
      return {
        ...list,
        cards: listCards,
      };
    })
  );

  return (
    <div>
      <DraggableBoard lists={listsWithCards} boardId={boardId} />
      <div className="px-6">
        <CreateListForm boardId={boardId} />
      </div>
    </div>
  );
}

export default Board;
