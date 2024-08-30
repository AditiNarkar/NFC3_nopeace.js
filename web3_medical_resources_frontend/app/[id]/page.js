"use client";
import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import styles from "../styles.module.css";
import Image from 'next/image';
import { getPaperById, getAccessibillity, accessPaper } from "@/utils/queries";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export default function Preview() {
    const { id } = useParams();
    const [paper, setPaper] = useState(null);
    const [haveAccess, setHaveAccess] = useState(false);
    const [userAddress, setUserAddress] = useState("");
    const { ready, authenticated } = usePrivy();
    const { wallets } = useWallets();


    useEffect(() => {
        async function fetchData() {
            console.log(ready, wallets.length)
            if (ready && wallets.length > 0) {
                const address = wallets[0]?.address || "0x0";
                setUserAddress(address);
                console.log("Address:", address);

                try {
                    // Fetch paper details by ID
                    const paperDetails = await getPaperById(id);
                    if (paperDetails && paperDetails.success) {
                        console.log("state:", paperDetails.data)
                        setPaper(paperDetails.data); // Adjust based on actual response structure
                    } else {
                        console.log("Failed to fetch paper details:", paperDetails.errorMessage);
                    }

                    const { success, data } = await getAccessibillity(address, id);
                    if (success) {
                        console.log("Has access:", data);
                        setHaveAccess(data);
                    } else {
                        console.log("Error:", data.message || "Unknown error");
                    }

                } catch (error) {
                    console.log("Error fetching data:", error || "Unknown error");
                }
            } else {
                console.log("Wallets not ready or empty:", wallets);
            }
        }

        fetchData();
    }, [ready, authenticated, wallets]);




    const handleGetAccess = async () => {
        if (!paper || !userAddress) {
            console.log("Paper or user address is not available.");
            return;
        }
        try {

            const tx = await accessPaper(userAddress, id);

            console.log("Access granted, transaction confirmed:", tx.hash);

            setHaveAccess(true);

        } catch (error) {
            console.log("Error granting access:", error);
        }
    };






    // Use fallback values if paper is not available
    const keywords = Array.isArray(paper?.[4]) ? paper[4] : [];
    const title = paper?.[1] || "No Title";
    const author = paper?.[0] || "Unknown Author";
    const postedBy = paper?.[2] || "Unknown";
    const accessFee = paper?.[3] || "0";
    // const currentWinPrize = paper?.currentWinPrize || "0";

    return (
        <>
            {paper ? (
                <div className={styles.previewContainer}>
                    <div className={styles.paperPreview}>
                        <Image
                            src={`/path/to/paper/${paper.contentHash}`}
                            width={310}
                            height={200}
                            alt="Paper Preview"
                        // You might need to update the src path based on how the contentHash is handled
                        />
                    </div>
                    <div className={styles.getAccess}>
                        <div style={{ display: "flex", justifyContent: "center", fontWeight: 600 }}>{title}</div>
                        <div>Authors: {author}</div>
                        <div>Posted By: {postedBy}</div>
                        <div>Keywords: {keywords[0]}</div>
                        <div>Access Fee: {accessFee.toString()} MCT</div>
                        {haveAccess ? (
                            <div>
                                <div>Current Win Prize: 6 MCT</div>
                                <button style={{ width: "100%" }} className={styles.ConnectButton}>Stake Contribution</button>
                            </div>
                        ) : (
                            <button style={{ width: "100%" }} className={styles.ConnectButton} onClick={handleGetAccess}>Get Access</button>
                        )}
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </>
    );
}
