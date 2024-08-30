"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import styles from "../styles.module.css";
import axios from 'axios';
import { uploadPaper } from "@/utils/queries";

export default function Publish() {
    const router = useRouter()
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [wordLimit, setWordLimit] = useState(0);
    const [additionalParams, setAdditionalParams] = useState("");
    const [accessAmount, setAccessAmount] = useState(0);
    const [contentHash, setContentHash] = useState("");
    const [uploading, setUploading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    const handlePinata = async (e) => {
        e.preventDefault();
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

    async function publishResearch(e) {
        e.preventDefault();
        if (!title || !contentHash || accessAmount <= 0) {
            setSubmitMessage("Please fill in all required fields.");
            return;
        }

        try {
            const response = await uploadPaper(title, contentHash, accessAmount, tags);
            console.log(response)
            if (response.success) {
                setSubmitMessage("Research published successfully.");
                router.push("/")
                // Optionally, reset the form or redirect the user
            } else {
                setSubmitMessage(`Error publishing research: ${response.errorMessage}`);
            }
        } catch (error) {
            console.log('Error publishing research:', error);
            setSubmitMessage("Error publishing research.");
        }
    }

    return (
        <>
            <div style={{ fontWeight: 800, padding: "30px", display: "flex", justifyContent: "center" }}>
                Publish Research
            </div>
            <div className={styles.contributionFormParent}>
                <div className={styles.contributionForm}>
                    <div style={{ width: "100%" }}>
                        <div>Research Title</div>
                        <input
                            style={{ height: 30, width: "100%" }}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div style={{ width: "100%" }}>
                        <div>Tags/Keywords</div>
                        <input style={{ height: 30, width: "100%" }} type="text" value={tags.join(', ')}
                            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))} />
                    </div>

                    <div style={{ width: "100%" }}>
                        <div>Set Contributing Word Limit</div>
                        <input style={{ height: 30, width: "100%" }} type="number" value={wordLimit}
                            onChange={(e) => setWordLimit(Number(e.target.value))} />
                    </div>
                    <div style={{ width: "100%" }}>
                        <div>Additional Parameters for Contributor</div>
                        <textarea style={{ height: 100, maxWidth: "100%", minWidth: "100%" }} type="text" value={additionalParams}
                            onChange={(e) => setAdditionalParams(e.target.value)} />
                    </div>

                    <div style={{ width: "100%" }}>
                        <div>Access Amount for your research (MCT)</div>
                        <input style={{ height: 30, width: "100%" }} type="number" value={accessAmount}
                            onChange={(e) => setAccessAmount(Number(e.target.value))} />
                    </div>

                    <div style={{ width: "100%" }}>
                        <div>Upload your research</div>
                        <input
                            style={{ height: 30, width: "100%" }}
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <button
                            style={{ width: "100%", border: "1px solid white" }}
                            className={styles.ConnectButton}
                            onClick={handlePinata}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Upload to IPFS"}
                        </button>
                    </div>

                    <div style={{ width: "100%" }}>
                        <button
                            style={{ width: "100%", border: "1px solid white" }}
                            className={styles.ConnectButton}
                            onClick={publishResearch}
                        >
                            Submit
                        </button>
                    </div>

                    {submitMessage && <div style={{ marginTop: "20px", color: "green" }}>{submitMessage}</div>}
                </div>

                <div className={styles.comments}>
                    <div style={{ width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            AI Summary for your research
                        </div>
                    </div>
                    <textarea
                        style={{ padding: "10px", maxHeight: "70vh", margin: "0 30px", height: "100%", width: "100%" }}
                        readOnly
                    >
                        hello
                    </textarea>
                </div>
            </div>
        </>
    );
}
