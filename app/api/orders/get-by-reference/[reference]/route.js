// app/api/orders/get-by-reference/[reference]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reference } = params;

    const order = await prisma.order.findFirst({
      where: {
        paymentReference: reference,
        userId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        // Include additional payment-related fields
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          totalAmount: true,
          subtotal: true,
          shippingCost: true,
          status: true,
          currency: true,
          // Payment specific fields
          paymentStatus: true,
          paymentMethod: true,
          paymentReference: true,
          paymentProvider: true,
          paymentData: true, // This includes the full Paystack response
          // Include other fields you need
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Format the response with clear payment information
    const formattedOrder = {
      ...order,
      payment: {
        method: order.paymentMethod,
        status: order.paymentStatus,
        reference: order.paymentReference,
        provider: order.paymentProvider,
        details: order.paymentData, // Contains provider-specific details
        currency: order.currency,
      },
      // Remove redundant fields from the main object
      paymentMethod: undefined,
      paymentStatus: undefined,
      paymentReference: undefined,
      paymentProvider: undefined,
      paymentData: undefined,
    };

    return NextResponse.json({
      success: true,
      order: formattedOrder,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
      },
      { status: 500 }
    );
  }
}
