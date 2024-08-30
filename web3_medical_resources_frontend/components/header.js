"use client";
import React, { useState, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import styles from "../app/styles.module.css";
import Image from "next/image";
import logo from "../assets/medicalchain_logo.png";

export default function Header() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  return (
    <>
      <div className={styles.Header}>
        <div className={styles.HeaderChild1}>
          <Image src={logo} width={100} height={70} />
          <div>About</div>
          <div>Contact</div>
        </div>
        <div className={styles.HeaderChild2}>
          <span> {ready ? wallets[0]?.address : "0x0"}</span>
          {authenticated ? (
            <button className={styles.ConnectButton} onClick={logout}>
              Disconnect
            </button>
          ) : (
            <button className={styles.ConnectButton} onClick={login}>
              connect
            </button>
          )}
        </div>
      </div>
    </>
  );
}
