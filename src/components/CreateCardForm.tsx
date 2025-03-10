"use client";

import React from "react";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { createCard } from "@/app/actions";

interface CreateCardFormProps {
  listId: string;
  boardId: string;
}

export default function CreateCardForm({
  listId,
  boardId,
}: CreateCardFormProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [content, setContent] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createCard(listId, content, boardId);
    setContent("");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start text-gray-500 h-auto py-2"
        onClick={() => setIsEditing(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add a card
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        placeholder="Enter card content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mb-2"
        autoFocus
      />
      <div className="flex items-center gap-1">
        <Button type="submit" size="sm">
          Add Card
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
