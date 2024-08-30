"use client";
import styles from "./styles.module.css";
import Image from "next/image";
import paper from "../assets/paperPhoto.png";
import Link from "next/link";
import { getTotalPapersByCount } from "@/utils/queries";
import { useEffect, useState } from "react";

export default function Home() {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    async function getAllPapers() {
      const fpapers = await getTotalPapersByCount();

      if (fpapers.success === false) {
        console.error("Failed to fetch papers:", fpapers.errorMessage);
        return;
      }

      setPapers(fpapers);
    }
    getAllPapers();
  }, []);

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
        {papers.length > 0 ? (
          papers.map((paper, i) => {
            const [author, title, contentHash, accessFee, keywords] = paper;
            return (
              <div key={i} className={styles.paperDetails}>
                <Image src={paper} width={310} height={200} alt={`Paper ${i + 1}`}></Image>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  ID: {i + 1}
                </div>
                <div style={{ wordWrap: "break-word", width: "100%" }}>
                  <strong>Title:</strong> {title} <br />
                  <strong>Author:</strong> {author} <br />
                  <strong>Access Fee:</strong> {accessFee.toString()} <br />
                  <strong>Keywords:</strong> {keywords}
                </div>
                <button style={{ width: "100%" }} className={styles.ConnectButton}>
                  <Link style={{ textDecoration: "none" }} href={`/${i + 1}`}>View</Link>
                </button>
              </div>
            );
          })
        ) : (
          <>Loading...</>
        )}
      </div>
    </>
  );
}
