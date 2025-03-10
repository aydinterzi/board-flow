"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/db";
import { boards, lists, cards } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";

export async function createBoard(title: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const board = await db
    .insert(boards)
    .values({
      title,
      userId,
    })
    .returning();

  revalidatePath("/dashboard");
  return board[0];
}

export async function createList(boardId: string, title: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get the highest position in the board
  const lastList = await db
    .select({ position: lists.position })
    .from(lists)
    .where(eq(lists.boardId, boardId))
    .orderBy(desc(lists.position))
    .limit(1)
    .then((rows) => rows[0]);

  const position = lastList ? lastList.position + 1 : 0;

  const list = await db
    .insert(lists)
    .values({
      title,
      boardId,
      position,
    })
    .returning();

  revalidatePath(`/dashboard/boards/${boardId}`);
  return list[0];
}

export async function createCard(
  listId: string,
  content: string,
  boardId: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get the highest position in the list
  const lastCard = await db
    .select({ position: cards.position })
    .from(cards)
    .where(eq(cards.listId, listId))
    .orderBy(desc(cards.position))
    .limit(1)
    .then((rows) => rows[0]);

  const position = lastCard ? lastCard.position + 1 : 0;

  const card = await db
    .insert(cards)
    .values({
      content,
      listId,
      position,
    })
    .returning();

  revalidatePath(`/dashboard/boards/${boardId}`);
  return card[0];
}
