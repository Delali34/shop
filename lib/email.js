// lib/email.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(orderId) {
  try {
    // Fetch order details with Prisma
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Generate the email HTML
    const emailHtml = `
      <div>
        <h1>Order Confirmation</h1>
        <p>Dear ${order.user.name},</p>
        <p>Thank you for your order! Here are your order details:</p>
        
        <h2>Order #${order.id}</h2>
        <p>Status: ${order.status}</p>
        <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
        
        <h3>Items:</h3>
        <ul>
          ${order.orderItems
            .map(
              (item) => `
                <li>
                  ${item.product.name} x ${item.quantity} - $${(
                item.priceAtTime * item.quantity
              ).toFixed(2)}
                </li>
              `
            )
            .join("")}
        </ul>
        
        <p>We'll notify you when your order ships.</p>
        
        <p>Best regards,<br>OpulenceTies Team</p>
      </div>
    `;

    // Send the email
    await resend.emails.send({
      from: "OpulenceTies <orders@your-domain.com>",
      to: order.user.email,
      subject: `Order Confirmation #${order.id}`,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
}
