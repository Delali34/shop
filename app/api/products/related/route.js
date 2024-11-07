// app/api/products/related/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const currentProductId = searchParams.get("productId");

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: parseInt(categoryId),
        NOT: {
          id: currentProductId ? parseInt(currentProductId) : undefined,
        },
      },
      take: 4,
    });

    return NextResponse.json({ products: relatedProducts });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 }
    );
  }
}
