// app/api/categories/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, description, slug, image_url } = await request.json();

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if slug exists for other categories
    const existingSlug = await prisma.category.findFirst({
      where: {
        slug: slug,
        NOT: {
          id: parseInt(id),
        },
      },
    });

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 400 }
      );
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        slug,
        imageUrl: image_url || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Update error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    // Use Prisma transaction to handle both operations
    const result = await prisma.$transaction(async (prisma) => {
      // Update any products that use this category
      await prisma.product.updateMany({
        where: {
          categoryId: parseInt(id),
        },
        data: {
          categoryId: null,
        },
      });

      // Delete the category
      const deletedCategory = await prisma.category.delete({
        where: {
          id: parseInt(id),
        },
      });

      return deletedCategory;
    });

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Delete error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Transform the data to match the expected format
    const transformedCategory = {
      ...category,
      product_count: category._count.products,
      _count: undefined,
    };

    return NextResponse.json({
      success: true,
      data: transformedCategory,
    });
  } catch (error) {
    console.error("Get category error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}
