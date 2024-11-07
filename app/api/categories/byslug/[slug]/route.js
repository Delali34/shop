import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: `Category not found: ${slug}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error in category/bySlug API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while fetching category",
      },
      { status: 500 }
    );
  }
}
