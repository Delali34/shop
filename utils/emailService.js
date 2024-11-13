// utils/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const sendOrderConfirmationEmail = async (order, customerEmail) => {
  // Create order items HTML with images - will be used in both templates
  const orderItemsHtml = order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center;">
            <img src="${item.product.imageUrl}" 
                 alt="${item.product.name}" 
                 style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 15px;"
            />
            <div>
              <div style="font-weight: 600; color: #333; margin-bottom: 5px;">
                ${item.product.name}
              </div>
              <div style="font-size: 14px; color: #666;">
                Brand: ${item.product.brand}
              </div>
            </div>
          </div>
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">
          GH₵${formatPrice(item.priceAtTime * item.quantity)}
        </td>
      </tr>
    `
    )
    .join("");

  // Customer email template
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: 'Arial', sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0; padding: 0; background-color: #f7f7f7;">
        <tr>
          <td align="center" style="padding: 45px 0;">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">OpulenceTies</h1>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px;">
                  <!-- Thank You Message -->
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 24px;">Thank You for Your Order!</h2>
                    <p style="color: #666666; margin: 0; font-size: 16px;">
                      We're preparing your items with care.
                    </p>
                  </div>

                  <!-- Order Info -->
                  <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                    <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Order Details</h3>
                    <p style="color: #666666; margin: 0 0 5px 0; font-size: 14px;">
                      <strong>Order Reference:</strong> ${
                        order.paymentReference
                      }
                    </p>
                    <p style="color: #666666; margin: 0 0 5px 0; font-size: 14px;">
                      <strong>Order Date:</strong> ${formatDate(
                        order.createdAt
                      )}
                    </p>
                  </div>

                  <!-- Products Table -->
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 30px;">
                    <thead>
                      <tr>
                        <th style="padding: 15px; background-color: #f8f9fa; border-bottom: 2px solid #eee; text-align: left; font-size: 14px; color: #333;">
                          Product
                        </th>
                        <th style="padding: 15px; background-color: #f8f9fa; border-bottom: 2px solid #eee; text-align: center; font-size: 14px; color: #333;">
                          Quantity
                        </th>
                        <th style="padding: 15px; background-color: #f8f9fa; border-bottom: 2px solid #eee; text-align: right; font-size: 14px; color: #333;">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      ${orderItemsHtml}
                    </tbody>
                  </table>

                  <!-- Order Summary -->
                  <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding: 5px 0; color: #666;">Subtotal</td>
                        <td style="padding: 5px 0; text-align: right; color: #666;">
                          GH₵${formatPrice(order.subtotal)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #666;">Shipping</td>
                        <td style="padding: 5px 0; text-align: right; color: #666;">
                          GH₵${formatPrice(order.shippingCost)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 15px 0 5px 0; font-weight: 700; color: #333; font-size: 18px;">
                          Total
                        </td>
                        <td style="padding: 15px 0 5px 0; text-align: right; font-weight: 700; color: #333; font-size: 18px;">
                          GH₵${formatPrice(order.totalAmount)}
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Shipping Details -->
                  <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                    <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Shipping Details</h3>
                    <p style="color: #666666; margin: 0 0 5px 0; font-size: 14px;">
                      ${order.shippingAddress.streetAddress}<br>
                      ${
                        order.shippingAddress.apartment
                          ? order.shippingAddress.apartment + "<br>"
                          : ""
                      }
                      ${order.shippingAddress.city}, ${
    order.shippingAddress.state
  } ${order.shippingAddress.postalCode}<br>
                      ${order.shippingAddress.country}<br>
                      <strong>Phone:</strong> ${order.shippingAddress.phone}
                    </p>
                  </div>

                  <!-- Support Section -->
                  <div style="text-align: center; padding: 30px 0; border-top: 1px solid #eee;">
                    <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
                    <p style="color: #666666; margin: 0; font-size: 14px;">
                      If you have any questions about your order, please contact our customer support team.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #eee;">
                  <p style="color: #666666; margin: 0 0 10px 0; font-size: 12px;">
                    This is an automated email from OpulenceTies. Please do not reply to this email.
                  </p>
                  <p style="color: #666666; margin: 0; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} OpulenceTies. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Admin email template
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: 'Arial', sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0; padding: 0; background-color: #f7f7f7;">
        <tr>
          <td align="center" style="padding: 45px 0;">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New Order Received</h1>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px;">
                  <!-- Order Info -->
                  <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                    <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Order Information</h3>
                    <p style="color: #666666; margin: 0 0 5px 0; font-size: 14px;">
                      <strong>Order Reference:</strong> ${
                        order.paymentReference
                      }<br>
                      <strong>Order Date:</strong> ${formatDate(
                        order.createdAt
                      )}<br>
                      <strong>Customer Email:</strong> ${order.user.email}<br>
                      <strong>Payment Status:</strong> ${
                        order.paymentStatus
                      }<br>
                      <strong>Order Status:</strong> ${order.status}
                    </p>
                  </div>

                  <!-- Products Table -->
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 30px;">
                    <thead>
                      <tr>
                        <th style="padding: 15px; background-color: #f8f9fa; border-bottom: 2px solid #eee; text-align: left; font-size: 14px; color: #333;">
                          Product
                        </th>
                        <th style="padding: 15px; background-color: #f8f9fa; border-bottom: 2px solid #eee; text-align: center; font-size: 14px; color: #333;">
                          Quantity
                        </th>
                        <th style="padding: 15px; background-color: #f8f9fa; border-bottom: 2px solid #eee; text-align: right; font-size: 14px; color: #333;">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      ${orderItemsHtml}
                    </tbody>
                  </table>

                  <!-- Order Summary -->
                  <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding: 5px 0; color: #666;">Subtotal</td>
                        <td style="padding: 5px 0; text-align: right; color: #666;">
                          GH₵${formatPrice(order.subtotal)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #666;">Shipping</td>
                        <td style="padding: 5px 0; text-align: right; color: #666;">
                          GH₵${formatPrice(order.shippingCost)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 15px 0 5px 0; font-weight: 700; color: #333; font-size: 18px;">
                          Total
                        </td>
                        <td style="padding: 15px 0 5px 0; text-align: right; font-weight: 700; color: #333; font-size: 18px;">
                          GH₵${formatPrice(order.totalAmount)}
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Customer Details -->
                  <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                    <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Customer Details</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                      <div>
                      <h4 style="color: #333333; margin: 0 0 10px 0; font-size: 16px;">Shipping Address</h4>
                      <p style="color: #666666; margin: 0 0 5px 0; font-size: 14px;">
                        ${order.shippingAddress.streetAddress}<br>
                        ${
                          order.shippingAddress.apartment
                            ? order.shippingAddress.apartment + "<br>"
                            : ""
                        }
                        ${order.shippingAddress.city}, ${
    order.shippingAddress.state
  } ${order.shippingAddress.postalCode}<br>
                        ${order.shippingAddress.country}<br>
                        <strong>Phone:</strong> ${order.shippingAddress.phone}
                      </p>
                    </div>
                    <div>
                      <h4 style="color: #333333; margin: 0 0 10px 0; font-size: 16px;">Billing Address</h4>
                      <p style="color: #666666; margin: 0 0 5px 0; font-size: 14px;">
                        ${order.billingAddress.streetAddress}<br>
                        ${
                          order.billingAddress.apartment
                            ? order.billingAddress.apartment + "<br>"
                            : ""
                        }
                        ${order.billingAddress.city}, ${
    order.billingAddress.state
  } ${order.billingAddress.postalCode}<br>
                        ${order.billingAddress.country}<br>
                        <strong>Phone:</strong> ${order.billingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                <p style="color: #666666; margin: 0; font-size: 12px;">
                  &copy; ${new Date().getFullYear()} OpulenceTies. Internal order notification.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

  try {
    // Create array of email promises
    const emailPromises = [
      // Customer email
      transporter.sendMail({
        from: {
          name: "OpulenceTies",
          address: process.env.EMAIL_USER,
        },
        to: customerEmail,
        subject: `OpulenceTies - Order Confirmation #${order.paymentReference}`,
        html: customerHtml,
      }),
      // Admin email
      transporter.sendMail({
        from: {
          name: "OpulenceTies Orders",
          address: process.env.EMAIL_USER,
        },
        to: process.env.ADMIN_EMAIL,
        subject: `OpulenceTies - New Order #${order.paymentReference}`,
        html: adminHtml,
      }),
    ];

    // Send both emails concurrently
    await Promise.all(emailPromises);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
