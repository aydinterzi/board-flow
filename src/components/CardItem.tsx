"use client";

import React from "react";
import { Textarea } from "./ui/textarea";
import { updateCardContent } from "@/app/actions";
import type { Card } from "@/db/schema";

interface CardItemProps {
  card: Card;
  boardId: string;
}

export default function CardItem({ card, boardId }: CardItemProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [content, setContent] = React.useState(card.content);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (content === card.content || !content.trim()) {
      setContent(card.content);
      setIsEditing(false);
      return;
    }

    await updateCardContent(card.id, content, boardId);
    setIsEditing(false);
  };

  React.useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
          if (e.key === "Escape") {
            setContent(card.content);
            setIsEditing(false);
          }
        }}
        className="resize-none"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="bg-white p-3 rounded shadow cursor-pointer hover:shadow-md transition-shadow"
    >
      {card.content}
    </div>
  );
}
