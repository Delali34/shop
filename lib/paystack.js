// lib/paystack.js
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_KEY;

if (!PAYSTACK_SECRET_KEY) {
  console.error(
    "PAYSTACK_SECRET_KEY is not configured in environment variables"
  );
}

if (!PAYSTACK_PUBLIC_KEY) {
  console.error(
    "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not configured in environment variables"
  );
}

export const initializePayment = async ({ email, amount, metadata }) => {
  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100), // Convert to kobo
          metadata,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/verify`,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("PayStack initialization error:", error);
    throw error;
  }
};

export const verifyPayment = async (reference) => {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("PayStack verification error:", error);
    throw error;
  }
};
