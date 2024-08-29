"use client";
import React from "react";
import styles from "./styles.module.css";
import Header from "@/components/header";
import "./globals.css";
import { defineChain } from "viem";
import { PrivyProvider } from "@privy-io/react-auth";

const Sepolia = defineChain({
  id: 11155111,
  name: "Sepolia test network",
  network: "Sepolia test network",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia test network",
    symbol: "SepoliaETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.infura.io/v3/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://sepolia.etherscan.io",
    },
  },
});


const LocalNetwork = defineChain({
  id: 31337, // Default Hardhat network ID
  name: "Local Hardhat Network",
  network: "Hardhat",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545/"], // URL for local Hardhat network
    },
  },
  blockExplorers: {
    default: {
      name: "Local Explorer",
      url: "http://127.0.0.1:8545/", // Replace with your local explorer URL if available
    },
  },
});


export default function RootLayout({ children }) {
  return (
    <html className={styles.html} lang="en">
      <body className={styles.body}>
        <PrivyProvider
          appId="cm0eywwns03q9viq63d5vmy6i"
          config={{
            appearance: {
              theme: "light",
              accentColor: "#676FFF",
              // logo: logo,
            },
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
            defaultChain: LocalNetwork,
            supportedChains: [LocalNetwork],
          }}
        >
          <Header />
          <div className={styles.parentContainer}>{children}</div>
        </PrivyProvider>
      </body>
    </html>
  );
}