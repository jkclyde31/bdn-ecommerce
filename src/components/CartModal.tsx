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
        className="w-[95%] sm:w-max absolute p-3 sm:p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-3 md:right-2 flex flex-col gap-4 sm:gap-6 z-20 max-h-[80vh] overflow-y-auto"
      >
        {!cart.lineItems ? (
          <div className="text-center py-4">Cart is Empty</div>
        ) : (
          <>
            <div className="flex justify-between items-center sticky top-0 bg-white pt-1 pb-2">
              <h2 className="text-lg sm:text-xl">Shopping Cart</h2>
              <button 
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="flex flex-col gap-5 sm:gap-8">
              {cart.lineItems.map((item) => (
                <div className="flex gap-3 sm:gap-4" key={item._id}>
                  {item.image && (
                    <Image
                      src={wixMedia.getScaledToFillImageUrl(
                        item.image,
                        60,
                        80,
                        {}
                      )}
                      alt=""
                      width={60}
                      height={80}
                      className="object-cover rounded-md sm:w-[72px] sm:h-[96px]"
                    />
                  )}
                  <div className="flex flex-col justify-between w-full min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2 sm:gap-8">
                        <h3 className="font-semibold text-sm sm:text-base truncate">
                          {item.productName?.original}
                        </h3>
                        <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          {item.quantity && item.quantity > 1 && (
                            <div className="text-xs text-green-500">
                              {item.quantity} x{" "}
                            </div>
                          )}
                          <span className="text-sm">${item.price?.amount}</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {item.availability?.status}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-500">Qty. {item.quantity}</span>
                      <button
                        className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
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
            
            <div className="mt-2">
              <div className="flex items-center justify-between font-semibold">
                <span>Subtotal</span>
                <span>${(cart as any).subtotal?.amount || "0.00"}</span>
                </div>
              <p className="text-gray-500 text-xs sm:text-sm mt-2 mb-4">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="flex gap-2 justify-between">
                <button className="rounded-md py-2.5 sm:py-3 px-3 sm:px-4 ring-1 ring-gray-300 hover:bg-gray-50 transition-colors text-xs sm:text-sm">
                  View Cart
                </button>
                <button
                  className="rounded-md py-2.5 sm:py-3 px-3 sm:px-4 bg-green-700 text-white hover:bg-green-800 transition-colors disabled:cursor-not-allowed disabled:opacity-75 text-xs sm:text-sm"
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


// "use client";

// import Image from "next/image";
// import { useCartStore } from "../../hooks/useCartStore";
// import { media as wixMedia } from "@wix/sdk";
// import { useWixClient } from "../../hooks/useWixClient";
// import { currentCart } from "@wix/ecom";
// import { useEffect, useRef } from 'react';

// interface CartModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const CartModal = ({ isOpen, onClose }: CartModalProps) => {
//   const modalRef = useRef<HTMLDivElement>(null);
//   const wixClient = useWixClient();
//   const { cart, isLoading, removeItem } = useCartStore();

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   const handleCheckout = async () => {
//     console.log(cart);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50">
//       <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
//       <div 
//         ref={modalRef}
//         className="w-[95%] sm:w-max absolute p-3 sm:p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-3 md:right-2 flex flex-col gap-4 sm:gap-6 z-20 max-h-[80vh] overflow-y-auto"
//       >
//         {!cart.lineItems ? (
//           <div className="text-center py-4">Cart is Empty</div>
//         ) : (
//           <>
//             <div className="flex justify-between items-center sticky top-0 bg-white pt-1 pb-2">
//               <h2 className="text-lg sm:text-xl">Shopping Cart</h2>
//               <button 
//                 onClick={onClose}
//                 className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div className="flex flex-col gap-5 sm:gap-8">
//               {cart.lineItems.map((item) => (
//                 <div className="flex gap-3 sm:gap-4" key={item._id}>
//                   {item.image && (
//                     <Image
//                       src={wixMedia.getScaledToFillImageUrl(
//                         item.image,
//                         60,
//                         80,
//                         {}
//                       )}
//                       alt=""
//                       width={60}
//                       height={80}
//                       className="object-cover rounded-md sm:w-[72px] sm:h-[96px]"
//                     />
//                   )}
//                   <div className="flex flex-col justify-between w-full min-w-0">
//                     <div>
//                       <div className="flex items-start justify-between gap-2 sm:gap-8">
//                         <h3 className="font-semibold text-sm sm:text-base truncate">
//                           {item.productName?.original}
//                         </h3>
//                         <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-1 sm:gap-2 flex-shrink-0">
//                           {item.quantity && item.quantity > 1 && (
//                             <div className="text-xs text-green-500">
//                               {item.quantity} x{" "}
//                             </div>
//                           )}
//                           <span className="text-sm">${item.price?.amount}</span>
//                         </div>
//                       </div>
//                       <div className="text-xs sm:text-sm text-gray-500">
//                         {item.availability?.status}
//                       </div>
//                     </div>
//                     <div className="flex justify-between text-xs sm:text-sm">
//                       <span className="text-gray-500">Qty. {item.quantity}</span>
//                       <button
//                         className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
//                         disabled={isLoading}
//                         onClick={() => removeItem(wixClient, item._id!)}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <div className="mt-2">
//               <div className="flex items-center justify-between font-semibold">
//                 <span>Subtotal</span>
//                 <span>${cart.subtotal?.amount || "0.00"}</span>
//               </div>
//               <p className="text-gray-500 text-xs sm:text-sm mt-2 mb-4">
//                 Shipping and taxes calculated at checkout.
//               </p>
//               <div className="flex gap-2 justify-between">
//                 <button className="rounded-md py-2.5 sm:py-3 px-3 sm:px-4 ring-1 ring-gray-300 hover:bg-gray-50 transition-colors text-xs sm:text-sm">
//                   View Cart
//                 </button>
//                 <button
//                   className="rounded-md py-2.5 sm:py-3 px-3 sm:px-4 bg-green-700 text-white hover:bg-green-800 transition-colors disabled:cursor-not-allowed disabled:opacity-75 text-xs sm:text-sm"
//                   disabled={isLoading}
//                   onClick={handleCheckout}
//                 >
//                   Checkout
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartModal;