import React from "react";
import { lists, cards } from "@/db/schema";
import db from "@/db";
import { eq } from "drizzle-orm";
import CreateListForm from "./CreateListForm";
import CreateCardForm from "./CreateCardForm";

interface BoardProps {
  boardId: string;
}

async function Board({ boardId }: BoardProps) {
  const boardLists = await db
    .select()
    .from(lists)
    .where(eq(lists.boardId, boardId))
    .orderBy(lists.position);

  const listCards = await Promise.all(
    boardLists.map(async (list) => {
      const cardsForList = await db
        .select()
        .from(cards)
        .where(eq(cards.listId, list.id))
        .orderBy(cards.position);
      return {
        listId: list.id,
        cards: cardsForList,
      };
    })
  );

  const cardsMap = Object.fromEntries(
    listCards.map(({ listId, cards }) => [listId, cards])
  );

  return (
    <div className="flex gap-4 overflow-x-auto p-6">
      {boardLists.map((list) => (
        <div
          key={list.id}
          className="bg-gray-100 p-4 rounded-lg w-72 flex-shrink-0"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{list.title}</h3>
          </div>
          <div className="space-y-2">
            {cardsMap[list.id]?.map((card) => (
              <div
                key={card.id}
                className="bg-white p-3 rounded shadow cursor-pointer hover:shadow-md transition-shadow"
              >
                {card.content}
              </div>
            ))}
            <CreateCardForm listId={list.id} boardId={boardId} />
          </div>
        </div>
      ))}
      <CreateListForm boardId={boardId} />
    </div>
  );
}

export default Board;
