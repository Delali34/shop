// app/api/orders/create/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      items,
      shippingAddress,
      billingAddress,
      subtotal,
      shippingCost,
      totalAmount,
      paymentReference,
      paymentData,
    } = await req.json();

    // Create shipping address
    const newShippingAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        ...shippingAddress,
      },
    });

    // Create billing address
    const newBillingAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        ...billingAddress,
      },
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        totalAmount,
        subtotal,
        shippingCost,
        shippingAddressId: newShippingAddress.id,
        billingAddressId: newBillingAddress.id,
        paymentStatus: "COMPLETED",
        paymentReference,
        paymentData,
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtTime: item.priceAtTime,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
