"use client"
import styles from "./styles.module.css";
import Image from "next/image";
import paper from "../assets/paperPhoto.png";
import Link from "next/link";
import { getPapers } from "@/utils/queries";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    async function getAllPapers() {
      const papers = await getPapers()
      console.log(papers)
    }
    getAllPapers()
  }, [])

  return (
    <>
      <div style={{ display: "flex", gap: 20, padding: "10px 20px" }}>
        <div>
          <input
            style={{ width: 600, height: 30 }}
            placeholder="Search"
          ></input>
        </div>
        <button style={{ left: "36vw" }} className={styles.ConnectButton}>
          <Link style={{ textDecoration: "none" }} href={`/publish`}>Publish Research</Link>
        </button>
      </div>

      <div className={styles.pageContainer}>
        <div className={styles.paperDetails}>
          <Image src={paper} width={310} height={200}></Image>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontWeight: 600,
            }}
          >
            Title
          </div>
          <div>Posted By:</div>

          <button style={{ width: "100%" }} className={styles.ConnectButton}>
            View
          </button>
        </div>
      </div>
    </>
  );
}
