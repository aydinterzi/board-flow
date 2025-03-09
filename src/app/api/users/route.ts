// app/api/users/route.ts
import { NextResponse } from "next/server";
import db from "@/db"; // Drizzle ORM ile yapılandırılmış veritabanı bağlantınız
import { users } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

// Kullanıcı oluşturma için gelen veriyi doğrulayan şema
const createUserSchema = z.object({
  clerkId: z.string(),
});

export async function POST(request: Request) {
  try {
    // İstek gövdesini JSON formatında alıyoruz
    console.log("test");
    const body = await request.json();
    const { clerkId } = createUserSchema.parse(body);

    // Veritabanında bu clerkId'ye sahip bir kullanıcı var mı kontrol ediyoruz
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId));

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 200 }
      );
    }

    // Yeni kullanıcı kaydını oluşturuyoruz
    await db.insert(users).values({
      clerkId,
      // createdAt alanı şema tarafından otomatik atanıyorsa burada belirtmeye gerek yok.
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
