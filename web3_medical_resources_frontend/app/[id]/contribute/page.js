"use client";
import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { getPaperById } from "@/utils/queries";
import axios from 'axios';



import styles from "../../styles.module.css";

export default function Contribution() {
    const { id } = useParams()
    const [paper, setPaper] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [base64Encoded, setBase64Encoded] = useState("");
    const [contentHash, setContentHash] = useState("");
``
    const [plagiarism, setPlagiarism] = useState("");
    const [file, setFile] = useState(null);

    const handleButtonClick = async (e) => {
        e.preventDefault();
        if (file) {
            await convertToBase64();
            await handlePinata();
        }
    };

    const convertToBase64 = () => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1];
            setBase64Encoded(base64String);
            console.log('Base64 Encoded String:', base64String);

            // Send the base64 string to the summarization API
            try {
                const response = await axios.post('http://127.0.0.1:5000/api/plagiarism', {
                    pdf: base64String
                });
                setPlagiarism(response.data.summary || "No summary available.");
                console.log('AI Summary:', response.data.summary);
            } catch (error) {
                console.error('Error fetching AI summary:', error);
                setPlagiarism("Error fetching AI summary.");
            }
        };
        reader.readAsDataURL(file);
    };

    const handlePinata = async () => {
        if (!file) {
            console.error("No file selected.");
            return;
        }
        setUploading(true);
        try {
            const fileData = new FormData();
            fileData.append('file', file);
            const responseData = await axios({
                method: "post",
                url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
                data: fileData,
                headers: {
                    pinata_api_key: 'a25b12c419c0c005544f',
                    pinata_secret_api_key: '03110679c4e45a5b29e6c71fc700007f1fdb6c7afce18affa0f3fe6e48c74543',
                    "Content-Type": 'multipart/form-data;',
                },
            });
            const fileUrl = `https://gateway.pinata.cloud/ipfs/${responseData.data.IpfsHash}`;
            console.log('File uploaded successfully:', fileUrl);
            setContentHash(responseData.data.IpfsHash);
            setSubmitMessage("File uploaded successfully.");
        } catch (error) {
            console.log('Error uploading file:', error);
            setSubmitMessage("Error uploading file.");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        async function fetchData() {


            try {
                // Fetch paper details by ID
                const paperDetails = await getPaperById(id);
                if (paperDetails && paperDetails.success) {
                    console.log("state:", paperDetails.data)
                    setPaper(paperDetails.data); // Adjust based on actual response structure
                } else {
                    console.log("Failed to fetch paper details:", paperDetails.errorMessage);
                }


            } catch (error) {
                console.log("Error fetching data:", error || "Unknown error");

            }
        }

        fetchData();
    }, []);
    return (
        <>
            <div style={{ fontWeight: 800, padding: "30px", display: "flex", justifyContent: "center" }}>Stake Research Contribution</div>
            <div className={styles.contributionFormParent}>
                <div className={styles.contributionForm}>
                    <div style={{ width: "100%" }}>
                        <div>Contributing on research {paper?.[1]} by {paper?.[0]} </div>
                    </div>

                    <div style={{ width: "100%" }}>
                        <div>Research Title</div>
                        <input style={{ height: 30, width: "100%" }} type="text" value="Medical"></input>
                    </div>
                    <div style={{ width: "100%" }}>
                        <div>Tags/Keywords</div>
                        <input style={{ height: 30, width: "100%" }} type="text" value="Healthcare"></input>
                    </div>
                    <div style={{ width: "100%" }}>
                        <div>Set Contributing Word Limit</div>
                        <input style={{ height: 30, width: "100%" }} type="number" value={2}></input>
                    </div>

                    <div style={{ width: "100%" }}>
                        <div>Additional Parameters for Contributor</div>
                        <textarea style={{ height: 30, maxWidth: "100%", minWidth: "100%" }} type="text">biology</textarea>
                    </div>

                    <div style={{ width: "100%" }}>
                        <div>Access Amount for your research(MCT)</div>
                        <input style={{ height: 30, width: "100%" }} type="number" value={2}></input>
                    </div>

                    <div style={{ width: "100%" }}>
                        <div>Stake Amount (MCT)</div>
                        <input style={{ height: 30, width: "100%" }} type="number" value={2}></input>
                    </div>

                    <div style={{ width: "100%" }}>
                        <div>Upload your research contribution</div>

                        <input style={{ height: 30, width: "100%" }} type="file" onChange={(e) => setFile(e.target.files[0])} ></input>
                    </div>
                    <button
                        style={{ width: "100%", border: "1px solid white" }}
                        className={styles.ConnectButton}
                        onClick={handleButtonClick}
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Upload to IPFS"}
                    </button>
                    <div style={{ width: "100%" }}>
                        <button style={{ width: "100%", border: "1px solid white" }} className={styles.ConnectButton}>Submit</button>

                    </div>
                </div>

                <div className={styles.comments}>
                    <div style={{ width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>Plagiarism Check</div>
                    </div>
                    <textarea value={plagiarism} readOnly style={{ padding: "10px", maxHeight: "70vh", margin: "0 30px", height: "100%", width: "100%" }}>Paper genuine with only 10% chance of plagiarism.</textarea>
                </div>
            </div>
        </>
    );
}