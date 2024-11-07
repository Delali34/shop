"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import useCartStore from "@/store/cartStore";
import { PaystackButton } from "react-paystack";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    shippingStreetAddress: "",
    shippingApartment: "",
    shippingCity: "",
    shippingState: "",
    shippingPostalCode: "",
    shippingCountry: "",
    shippingPhone: "",
    billingStreetAddress: "",
    billingApartment: "",
    billingCity: "",
    billingState: "",
    billingPostalCode: "",
    billingCountry: "",
    billingPhone: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  const subtotal = getSubtotal();
  const shippingCost = 20.0;
  const totalAmount = subtotal + shippingCost;

  useEffect(() => {
    if (isClient) {
      if (!session) {
        router.push(`/login?callbackUrl=${encodeURIComponent("/checkout")}`);
      } else if (items.length === 0 && searchParams.get("reference")) {
        router.push(
          `/order-success?reference=${searchParams.get("reference")}`
        );
      }
    }
  }, [session, items.length, isClient, router, searchParams]);

  if (!isClient || !session || items.length === 0) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (sameAsBilling && name.startsWith("shipping")) {
      const billingField = name.replace("shipping", "billing");
      setFormData((prev) => ({
        ...prev,
        [billingField]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "shippingStreetAddress",
      "shippingCity",
      "shippingState",
      "shippingPostalCode",
      "shippingCountry",
      "shippingPhone",
    ];

    if (!sameAsBilling) {
      requiredFields.push(
        "billingStreetAddress",
        "billingCity",
        "billingState",
        "billingPostalCode",
        "billingCountry",
        "billingPhone"
      );
    }

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaystackSuccess = async (response) => {
    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const shippingAddress = {
        type: "shipping",
        streetAddress: formData.shippingStreetAddress,
        apartment: formData.shippingApartment,
        city: formData.shippingCity,
        state: formData.shippingState,
        postalCode: formData.shippingPostalCode,
        country: formData.shippingCountry,
        phone: formData.shippingPhone,
      };

      const billingAddress = {
        type: "billing",
        streetAddress: sameAsBilling
          ? formData.shippingStreetAddress
          : formData.billingStreetAddress,
        apartment: sameAsBilling
          ? formData.shippingApartment
          : formData.billingApartment,
        city: sameAsBilling ? formData.shippingCity : formData.billingCity,
        state: sameAsBilling ? formData.shippingState : formData.billingState,
        postalCode: sameAsBilling
          ? formData.shippingPostalCode
          : formData.billingPostalCode,
        country: sameAsBilling
          ? formData.shippingCountry
          : formData.billingCountry,
        phone: sameAsBilling ? formData.shippingPhone : formData.billingPhone,
      };

      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          priceAtTime: item.price,
        })),
        shippingAddress,
        billingAddress,
        subtotal,
        shippingCost,
        totalAmount,
        paymentReference: response.reference,
        paymentData: response,
      };

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to create order");

      clearCart();
      router.push(`/order-success?reference=${response.reference}`);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: session.user.email,
    amount: Math.round(totalAmount * 100),
    currency: "GHS",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-luxury mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-luxury mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <input
                    name="shippingStreetAddress"
                    value={formData.shippingStreetAddress}
                    onChange={handleInputChange}
                    placeholder="Street Address *"
                    className={`w-full p-2 border rounded ${
                      errors.shippingStreetAddress ? "border-red-500" : ""
                    }`}
                  />
                  {errors.shippingStreetAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.shippingStreetAddress}
                    </p>
                  )}
                </div>
                <input
                  name="shippingApartment"
                  value={formData.shippingApartment}
                  onChange={handleInputChange}
                  placeholder="Apartment (optional)"
                  className="w-full p-2 border rounded"
                />
                <div>
                  <input
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleInputChange}
                    placeholder="City *"
                    className={`w-full p-2 border rounded ${
                      errors.shippingCity ? "border-red-500" : ""
                    }`}
                  />
                  {errors.shippingCity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.shippingCity}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    name="shippingState"
                    value={formData.shippingState}
                    onChange={handleInputChange}
                    placeholder="State *"
                    className={`w-full p-2 border rounded ${
                      errors.shippingState ? "border-red-500" : ""
                    }`}
                  />
                  {errors.shippingState && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.shippingState}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    name="shippingPostalCode"
                    value={formData.shippingPostalCode}
                    onChange={handleInputChange}
                    placeholder="Postal Code *"
                    className={`w-full p-2 border rounded ${
                      errors.shippingPostalCode ? "border-red-500" : ""
                    }`}
                  />
                  {errors.shippingPostalCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.shippingPostalCode}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    name="shippingCountry"
                    value={formData.shippingCountry}
                    onChange={handleInputChange}
                    placeholder="Country *"
                    className={`w-full p-2 border rounded ${
                      errors.shippingCountry ? "border-red-500" : ""
                    }`}
                  />
                  {errors.shippingCountry && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.shippingCountry}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    name="shippingPhone"
                    value={formData.shippingPhone}
                    onChange={handleInputChange}
                    placeholder="Phone *"
                    className={`w-full p-2 border rounded ${
                      errors.shippingPhone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.shippingPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.shippingPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-luxury mb-4">Billing Address</h2>
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="sameAsBilling"
                    checked={sameAsBilling}
                    onChange={(e) => {
                      setSameAsBilling(e.target.checked);
                      if (e.target.checked) {
                        setFormData((prev) => ({
                          ...prev,
                          billingStreetAddress: prev.shippingStreetAddress,
                          billingApartment: prev.shippingApartment,
                          billingCity: prev.shippingCity,
                          billingState: prev.shippingState,
                          billingPostalCode: prev.shippingPostalCode,
                          billingCountry: prev.shippingCountry,
                          billingPhone: prev.shippingPhone,
                        }));
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="sameAsBilling">
                    Same as shipping address
                  </label>
                </div>

                {!sameAsBilling && (
                  <>
                    <div>
                      <input
                        name="billingStreetAddress"
                        value={formData.billingStreetAddress}
                        onChange={handleInputChange}
                        placeholder="Street Address *"
                        className={`w-full p-2 border rounded ${
                          errors.billingStreetAddress ? "border-red-500" : ""
                        }`}
                      />
                      {errors.billingStreetAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingStreetAddress}
                        </p>
                      )}
                    </div>
                    <input
                      name="billingApartment"
                      value={formData.billingApartment}
                      onChange={handleInputChange}
                      placeholder="Apartment (optional)"
                      className="w-full p-2 border rounded"
                    />
                    <div>
                      <input
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleInputChange}
                        placeholder="City *"
                        className={`w-full p-2 border rounded ${
                          errors.billingCity ? "border-red-500" : ""
                        }`}
                      />
                      {errors.billingCity && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingCity}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="billingState"
                        value={formData.billingState}
                        onChange={handleInputChange}
                        placeholder="State *"
                        className={`w-full p-2 border rounded ${
                          errors.billingState ? "border-red-500" : ""
                        }`}
                      />
                      {errors.billingState && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingState}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="billingPostalCode"
                        value={formData.billingPostalCode}
                        onChange={handleInputChange}
                        placeholder="Postal Code *"
                        className={`w-full p-2 border rounded ${
                          errors.billingPostalCode ? "border-red-500" : ""
                        }`}
                      />
                      {errors.billingPostalCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingPostalCode}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="billingCountry"
                        value={formData.billingCountry}
                        onChange={handleInputChange}
                        placeholder="Country *"
                        className={`w-full p-2 border rounded ${
                          errors.billingCountry ? "border-red-500" : ""
                        }`}
                      />
                      {errors.billingCountry && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingCountry}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="billingPhone"
                        value={formData.billingPhone}
                        onChange={handleInputChange}
                        placeholder="Phone *"
                        className={`w-full p-2 border rounded ${
                          errors.billingPhone ? "border-red-500" : ""
                        }`}
                      />
                      {errors.billingPhone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingPhone}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-luxury mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>GH₵{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>GH₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>GH₵{shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>Total</span>
                  <span>GH₵{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <PaystackButton
                {...config}
                text="Pay Now"
                onSuccess={handlePaystackSuccess}
                onClose={() => console.log("Payment canceled")}
                className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
