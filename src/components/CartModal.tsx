"use client";

import Image from "next/image";
import { useCartStore } from "../../hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "../../hooks/useWixClient";
import { currentCart } from "@wix/ecom";
import { useEffect, useRef } from 'react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleCheckout = async () => {
    console.log(cart);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div 
        ref={modalRef}
        className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-3 md:right-2 flex flex-col gap-6 z-20"
      >
        {!cart.lineItems ? (
          <div className="text-center py-4">Cart is Empty</div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Shopping Cart</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="flex flex-col gap-8">
              {cart.lineItems.map((item) => (
                <div className="flex gap-4" key={item._id}>
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
                  <div className="flex flex-col justify-between w-full">
                    <div className="">
                      <div className="flex items-center justify-between gap-8">
                        <h3 className="font-semibold">
                          {item.productName?.original}
                        </h3>
                        <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                          {item.quantity && item.quantity > 1 && (
                            <div className="text-xs text-green-500">
                              {item.quantity} x{" "}
                            </div>
                          )}
                          ${item.price?.amount}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.availability?.status}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Qty. {item.quantity}</span>
                      <button
                        className="text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                        onClick={() => removeItem(wixClient, item._id!)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="">
              <div className="flex items-center justify-between font-semibold">
                <span className="">Subtotal</span>
              </div>
              <p className="text-gray-500 text-sm mt-2 mb-4">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="flex justify-between text-sm">
                <button className="rounded-md py-3 px-4 ring-1 ring-gray-300 hover:bg-gray-50 transition-colors">
                  View Cart
                </button>
                <button
                  className="rounded-md py-3 px-4 bg-black text-white hover:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:opacity-75"
                  disabled={isLoading}
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;