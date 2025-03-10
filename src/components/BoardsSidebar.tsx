import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

const MOCK_BOARDS = [
  { id: "1", title: "Personal Tasks" },
  { id: "2", title: "Work Projects" },
  { id: "3", title: "Shopping List" },
];

const BoardsSidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-50 border-r border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Boards</h2>
        <Button size="sm" className="flex items-center gap-1">
          <PlusCircle className="w-4 h-4" />
          New
        </Button>
      </div>
      <div className="space-y-1">
        {MOCK_BOARDS.map((board) => (
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
};

export default BoardsSidebar;
