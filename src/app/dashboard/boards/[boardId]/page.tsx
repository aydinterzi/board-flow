import React from "react";

export default function BoardPage({ params }: { params: { boardId: string } }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Board Title</h1>
        <div className="flex gap-2">{/* Add board actions here */}</div>
      </div>
      <div className="flex gap-4">
        {/* Add lists and cards here */}
        <div className="bg-gray-100 p-4 rounded-lg w-72">
          <h3 className="font-medium mb-2">To Do</h3>
          <div className="space-y-2">
            {/* Add cards here */}
            <div className="bg-white p-3 rounded shadow">Sample task card</div>
          </div>
        </div>
      </div>
    </div>
  );
}
