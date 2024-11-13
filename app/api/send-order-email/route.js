// app/api/send-order-email/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/utils/emailService";

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    // Fetch complete order details with related data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Send email notifications
    await sendOrderConfirmationEmail(order, order.user.email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending order email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
