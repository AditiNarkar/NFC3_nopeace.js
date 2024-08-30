"use client";
import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import styles from "../styles.module.css";
import Image from 'next/image';
import { getPaperById, getAccessibillity, accessPaper } from "@/utils/queries";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import Link from "next/link";


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

                    // const ipfs = paper[2]
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
            alert("You have been granted access")

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
    const ipfs = paper?.[2] || 'QmYsQ3ocf3XYqTsvJDSticUEyip7TiXH7oamfJ1kdaNvDV'
    const file = `https://gateway.pinata.cloud/ipfs/${ipfs}`
    // const file = paper?.[2] || 'https://gateway.pinata.cloud/ipfs/QmYsQ3ocf3XYqTsvJDSticUEyip7TiXH7oamfJ1kdaNvDV'


    return (
        <>
            {paper ? (
                <div className={styles.previewContainer}>
                    <div className={styles.paperPreview}>
                        {/* <Image
                            src={`/path/to/paper/${paper.contentHash}`}
                            width={310}
                            height={200}
                            alt="Paper Preview"
                        // You might need to update the src path based on how the contentHash is handled
                        /> */}
                        <iframe src={file} width={550} height={550} title="Preview"></iframe>
                    </div>
                    <div className={styles.getAccess}>
                        <div style={{ display: "flex", justifyContent: "center", fontWeight: 600 }}>{title}</div>
                        <div>Authors: {author}</div>

                        <div>Keywords: {keywords[0]}</div>
                        <div>Access Fee: {accessFee.toString()} MCT</div>
                        {haveAccess ? (
                            <div>
                                <div>Current Win Prize: 6 MCT</div>
                                <Link href={`${id}/contribute`}>
                                    <button style={{ width: "100%" }} className={styles.ConnectButton}>Stake Contribution</button>
                                </Link>
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
