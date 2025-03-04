"use client";

import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import Cookies from "js-cookie";
import { createContext, ReactNode, useEffect, useState } from "react";
import { redirects } from '@wix/redirects';

export type WixClient = ReturnType<typeof createClient>;

export const WixClientContext = createContext<WixClient | null>(null);

export const WixClientContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [wixClient, setWixClient] = useState<WixClient | null>(null);

  useEffect(() => {
    // Initialize the Wix client with tokens from cookies
    const refreshToken = JSON.parse(Cookies.get("refreshToken") || "{}");

    const client = createClient({
      modules: {
        products,
        collections,
        currentCart,
        redirects,
      },
      auth: OAuthStrategy({
        clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
        tokens: {
          refreshToken,
          accessToken: { value: "", expiresAt: 0 },
        },
      }),
    });

    setWixClient(client);
  }, []);

  // Function to update tokens in the Wix client
  const updateTokens = (tokens: {
    refreshToken: { value: string; expiresAt: number };
    accessToken: { value: string; expiresAt: number };
  }) => {
    if (wixClient) {
      wixClient.auth.setTokens(tokens);
      // Optionally, update cookies with the new tokens
      Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
        expires: new Date(tokens.refreshToken.expiresAt * 1000),
      });
    }
  };

  return (
    <WixClientContext.Provider value={{ ...wixClient, updateTokens }}>
      {children}
    </WixClientContext.Provider>
  );
};