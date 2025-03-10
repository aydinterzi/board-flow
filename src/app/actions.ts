"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import db from "@/db";
import { boards, lists, cards, boardMembers } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { desc, and } from "drizzle-orm";
import { eq, sql } from "drizzle-orm";
import { pusherServer } from "@/lib/pusher";

export async function createBoard(title: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const board = await db.transaction(async (tx) => {
    const [newBoard] = await tx
      .insert(boards)
      .values({
        title,
        userId,
      })
      .returning();

    // Add creator as owner
    await tx.insert(boardMembers).values({
      boardId: newBoard.id,
      userId,
      role: "owner",
    });

    return newBoard;
  });

  revalidatePath("/dashboard");
  return board;
}

export async function createList(boardId: string, title: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await checkBoardAccess(userId, boardId);

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

  await broadcastBoardUpdate(boardId);
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

  await checkBoardAccess(userId, boardId);

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

  await broadcastBoardUpdate(boardId);
  revalidatePath(`/dashboard/boards/${boardId}`);
  return card[0];
}

async function broadcastBoardUpdate(boardId: string) {
  await pusherServer.trigger(`board-${boardId}`, "board-update", {
    timestamp: new Date().toISOString(),
  });
}

export async function updateCardPosition(
  cardId: string,
  newListId: string,
  newPosition: number,
  boardId: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await checkBoardAccess(userId, boardId);

  // Update positions of other cards in the list
  await db.execute(sql`
    UPDATE cards 
    SET position = position + 1 
    WHERE list_id = ${newListId} 
    AND position >= ${newPosition}
  `);

  // Update the dragged card
  await db
    .update(cards)
    .set({
      listId: newListId,
      position: newPosition,
    })
    .where(eq(cards.id, cardId));

  await broadcastBoardUpdate(boardId);
  revalidatePath(`/dashboard/boards/${boardId}`);
}

export async function updateCardContent(
  cardId: string,
  content: string,
  boardId: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await checkBoardAccess(userId, boardId);

  await db.update(cards).set({ content }).where(eq(cards.id, cardId));

  await broadcastBoardUpdate(boardId);
  revalidatePath(`/dashboard/boards/${boardId}`);
}

export async function addBoardMember(boardId: string, email: string) {
  const client = await clerkClient();

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Check if user is board owner
  const member = await db
    .select()
    .from(boardMembers)
    .where(
      and(
        eq(boardMembers.boardId, boardId),
        eq(boardMembers.userId, userId),
        eq(boardMembers.role, "owner")
      )
    )
    .then((rows) => rows[0]);

  if (!member) throw new Error("Unauthorized");

  // Get user by email using Clerk
  const clerkUser = await client.users.getUserList({
    emailAddress: [email],
  });

  // Add new member
  await db.insert(boardMembers).values({
    boardId,
    userId: clerkUser.data[0].id,
    role: "member",
  });

  await broadcastBoardUpdate(boardId);
  revalidatePath(`/dashboard/boards/${boardId}`);
}

async function checkBoardAccess(userId: string, boardId: string) {
  const member = await db
    .select()
    .from(boardMembers)
    .where(
      and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, userId))
    )
    .then((rows) => rows[0]);

  if (!member) throw new Error("Unauthorized");
  return member;
}
