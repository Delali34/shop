// app/api/orders/[id]/shipping/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const updatedOrder = await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        trackingNumber: data.trackingNumber,
        status: data.status || "PROCESSING",
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

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating shipping:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update shipping information",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
