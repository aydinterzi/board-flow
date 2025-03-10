"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { Input } from "./ui/input";
import { createBoard } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function CreateBoardDialog() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const board = await createBoard(title);
    setOpen(false);
    setTitle("");
    router.push(`/dashboard/boards/${board.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-1">
          <PlusCircle className="w-4 h-4" />
          New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Board title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Create Board
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
