"use client";

import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { updateCardPosition } from "@/app/actions";
import CreateCardForm from "./CreateCardForm";
import CardItem from "./CardItem";
import type { Card, List } from "@/db/schema";
import { useBoardSubscription } from "@/hooks/useBoardSubscription";

interface DraggableBoardProps {
  lists: (List & { cards: Card[] })[];
  boardId: string;
}

export default function DraggableBoard({
  lists: initialLists,
  boardId,
}: DraggableBoardProps) {
  const [lists, setLists] = React.useState(initialLists);

  // Subscribe to real-time updates
  useBoardSubscription(boardId);

  // Update lists when props change
  React.useEffect(() => {
    setLists(initialLists);
  }, [initialLists]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceListId = result.source.droppableId;
    const destListId = result.destination.droppableId;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    const cardId = result.draggableId;

    // Optimistically update the UI
    setLists((currentLists) => {
      const newLists = currentLists.map((list) => ({
        ...list,
        cards: [...list.cards],
      }));

      // Find source and destination lists
      const sourceList = newLists.find((l) => l.id === sourceListId);
      const destList = newLists.find((l) => l.id === destListId);

      if (!sourceList || !destList) return currentLists;

      // Remove card from source list
      const [movedCard] = sourceList.cards.splice(sourceIndex, 1);
      // Add card to destination list
      destList.cards.splice(destIndex, 0, movedCard);

      return newLists;
    });

    // Update the server
    try {
      await updateCardPosition(cardId, destListId, destIndex, boardId);
    } catch (error) {
      // If the server update fails, revert to the initial state
      setLists(initialLists);
      console.error("Failed to update card position:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-6">
        {lists.map((list) => (
          <div
            key={list.id}
            className="bg-gray-100 p-4 rounded-lg w-72 flex-shrink-0"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{list.title}</h3>
            </div>
            <Droppable droppableId={list.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  {list.cards.map((card, index) => (
                    <Draggable
                      key={card.id}
                      draggableId={card.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <CardItem card={card} boardId={boardId} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <CreateCardForm listId={list.id} boardId={boardId} />
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
