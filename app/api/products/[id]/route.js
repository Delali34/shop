// app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // First, delete all related order items
    await prisma.orderItem.deleteMany({
      where: {
        productId: parseInt(id),
      },
    });

    // Then delete the product
    const product = await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete product. It might be referenced in orders.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        brand: body.brand || "",
        price: parseFloat(body.price),
        description: body.description || "",
        imageUrl: body.image_url || "",
        categoryId: body.category_id ? parseInt(body.category_id) : null,
        stockQuantity: parseInt(body.stock_quantity) || 0,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
