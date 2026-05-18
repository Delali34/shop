// app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

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
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

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
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const { id } = params;
    const body = await request.json();

    const incomingImage = body.image_url ?? body.imageUrl;
    const updateData = {
      name: body.name,
      brand: body.brand || "",
      price: parseFloat(body.price),
      description: body.description || "",
      categoryId:
        (body.category_id ?? body.categoryId)
          ? parseInt(body.category_id ?? body.categoryId)
          : null,
      stockQuantity:
        parseInt(body.stock_quantity ?? body.stockQuantity) || 0,
    };
    if (typeof incomingImage === "string" && incomingImage.length > 0) {
      updateData.imageUrl = incomingImage;
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
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
