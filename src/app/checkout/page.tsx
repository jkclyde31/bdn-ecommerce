"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "../../../hooks/useCartStore";
import { useWixClient } from "../../../hooks/useWixClient";
import Image from "next/image";
import { media as wixMedia } from "@wix/sdk";

interface PickupDetails {
  preferredLocation: string;
  contactNumber: string;
  notes: string;
}

const PICKUP_LOCATIONS = [
  "Main Street Branch",
  "Downtown Store",
  "North Mall Branch",
];

const CheckoutPage = () => {
  const router = useRouter();
  const wixClient = useWixClient();
  const { cart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickupDetails, setPickupDetails] = useState<PickupDetails>({
    preferredLocation: "",
    contactNumber: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPickupDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format the cart details for the message
      const cartSummary = cart.lineItems
        .map(
          (item) =>
            `${item.productName?.original} (Qty: ${item.quantity}) - $${item.price?.amount}`
        )
        .join("\n");

      // Format the full message
      const message = `
        New Order Received! 🎉
        ---------------------
        **Order Details:**
        ${cartSummary}
        ---------------------
        **Subtotal:** $${cart.subtotal?.amount}
        **Payment Method:** Cash on Pickup
        ---------------------
        **Pickup Details:**
        - Location: ${pickupDetails.preferredLocation}
        - Contact: ${pickupDetails.contactNumber}
        - Notes: ${pickupDetails.notes || "N/A"}
      `;

      // Send the message to Messenger
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // // Clear the cart after successful submission
      // await clearCart(wixClient);

      alert("Message sent successfully!");
      router.push("/order-success"); // Redirect to a success page
    } catch (error) {
      console.error("Error sending message:", error + " : ", process.env.FACEBOOK_PAGE_ACCESS_TOKEN);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart.lineItems || cart.lineItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pickup Details Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Pickup Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Location*</label>
              <select
                name="preferredLocation"
                required
                value={pickupDetails.preferredLocation}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a pickup location</option>
                {PICKUP_LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact Number*</label>
              <input
                type="tel"
                name="contactNumber"
                required
                value={pickupDetails.contactNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="For pickup coordination"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Additional Notes</label>
              <textarea
                name="notes"
                value={pickupDetails.notes}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Any special instructions or requests"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4">
            {cart.lineItems.map((item) => (
              <div key={item._id} className="flex gap-4 py-2 border-b">
                {item.image && (
                  <Image
                    src={wixMedia.getScaledToFillImageUrl(
                      item.image,
                      72,
                      96,
                      {}
                    )}
                    alt=""
                    width={72}
                    height={96}
                    className="object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.productName?.original}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="font-medium">${item.price?.amount}</p>
                </div>
              </div>
            ))}
            <div className="pt-4">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>${cart.subtotal?.amount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Payment Method</span>
                <span>Cash on Pickup</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Total to Pay</span>
                <span>${cart.subtotal?.amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;