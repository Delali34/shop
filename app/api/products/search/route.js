import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("query");

    if (!searchQuery) {
      return NextResponse.json(
        {
          success: false,
          error: "Search query is required",
        },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { brand: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
      include: {
        category: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      take: 10,
    });

    // Add cache-control headers
    const headers = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    };

    return NextResponse.json(
      {
        success: true,
        data: products,
      },
      {
        headers,
      }
    );
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
