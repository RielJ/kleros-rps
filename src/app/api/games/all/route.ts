import prisma from "@/prisma-client";
import { Game, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not Allowed" },
      { status: 405 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address") || "";
    const chainId = searchParams.get("chainId") || "";
    const games: Game[] = await prisma.game.findMany({
      where: {
        AND: [
          { OR: [{ player1: address }, { player2: address }] },
          { chainId },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ data: games }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", error: err },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not Allowed" },
      { status: 405 }
    );
  }

  try {
    const game: Prisma.GameCreateInput = await req.json();
    const savedGame = await prisma.game.create({ data: game });
    return NextResponse.json({ data: savedGame }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", error: err },
      { status: 400 }
    );
  }
}
