// app/api/orders/[id]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Add this line

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session in PUT order:", session); // Debug log

    // First check if there's a session at all
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user from database to verify role
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        role: true,
      },
    });

    console.log("User role:", user?.role); // Debug log

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const data = await request.json();
    console.log("Update data:", data); // Debug log

    const updatedOrder = await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        status: data.status,
        ...(data.trackingNumber && { trackingNumber: data.trackingNumber }),
        ...(data.shippingMethod && { shippingMethod: data.shippingMethod }),
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
      },
    });

    console.log("Order updated successfully"); // Debug log

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error in PUT /api/orders/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
