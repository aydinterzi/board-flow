"use client";

import React from "react";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import { Input } from "./ui/input";
import { createList } from "@/app/actions";

export default function CreateListForm({ boardId }: { boardId: string }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [title, setTitle] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createList(boardId, title);
    setTitle("");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Button
        variant="outline"
        className="h-10 w-72 flex-shrink-0"
        onClick={() => setIsEditing(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add another list
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-72 bg-gray-100 p-2 rounded-lg">
      <Input
        placeholder="Enter list title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2"
        autoFocus
      />
      <div className="flex items-center gap-1">
        <Button type="submit" size="sm">
          Add List
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
