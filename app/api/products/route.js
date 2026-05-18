import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");

    const where = categoryId ? { categoryId: parseInt(categoryId) } : {};

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const body = await request.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: "Name and price are required" },
        { status: 400 }
      );
    }

    const price = parseFloat(body.price);

    if (isNaN(price)) {
      return NextResponse.json(
        { success: false, error: "Invalid price format" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        brand: body.brand || "",
        price: price,
        description: body.description || "",
        imageUrl: body.image_url || "",
        categoryId: body.category_id ? parseInt(body.category_id) : null,
        stockQuantity: parseInt(body.stock_quantity) || 0,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const price = parseFloat(body.price);

    if (isNaN(price)) {
      return NextResponse.json(
        { success: false, error: "Invalid price format" },
        { status: 400 }
      );
    }

    // Check if product exists first
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(body.id) },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Only overwrite the image when a new URL is explicitly provided.
    // Empty string / undefined => keep existing image.
    const incomingImage = body.image_url ?? body.imageUrl;
    const updateData = {
      name: body.name,
      brand: body.brand || "",
      price: price,
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
      where: { id: parseInt(body.id) },
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
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update product. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    // Begin transaction
    const result = await prisma.$transaction(async (prisma) => {
      // First check if product exists
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: {
          orderItems: true,
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // Delete related order items first
      if (product.orderItems.length > 0) {
        await prisma.orderItem.deleteMany({
          where: {
            productId: parseInt(id),
          },
        });
      }

      // Then delete the product
      const deletedProduct = await prisma.product.delete({
        where: { id: parseInt(id) },
      });

      return deletedProduct;
    });

    return NextResponse.json({
      success: true,
      message: "Product and related items deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    if (error.message === "Product not found") {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Handle foreign key constraint errors
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cannot delete product as it is referenced in orders. Please delete related orders first.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete product. Please try again.",
      },
      { status: 500 }
    );
  }
}
