"use client";
import React, { useState } from "react";
import styles from "../styles.module.css";
import axios from 'axios';
import { uploadPaper, getPapers } from "@/utils/queries";

export default function Publish() {
    const [file, setFile] = useState("");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [wordLimit, setWordLimit] = useState(0);
    const [additionalParams, setAdditionalParams] = useState("");
    const [accessAmount, setAccessAmount] = useState(0);
    const [contentHash, setContentHash] = useState("");
    //QmYsQ3ocf3XYqTsvJDSticUEyip7TiXH7oamfJ1kdaNvDV
    async function publishResearch(e) {
        e.preventDefault();
        const response = await uploadPaper(title, contentHash, accessAmount, tags)
        console.log(response)

        const papers = await getPapers()
        console.log(papers)

    }

    const handlePinata = async (e) => {
        e.preventDefault();
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
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

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
                            onChange={(e) => setWordLimit(e.target.value)} />
                    </div>
                    <div style={{ width: "100%" }}>
                        <div>Additional Parameters for Contributor</div>
                        <textarea style={{ height: 30, maxWidth: "100%", minWidth: "100%" }} type="text" value={additionalParams}
                            onChange={(e) => setAdditionalParams(e.target.value)} />
                    </div>

                    <div style={{ width: "100%" }}>
                        <div>Access Amount for your research (MCT)</div>
                        <input style={{ height: 30, width: "100%" }} type="number" value={accessAmount}
                            onChange={(e) => setAccessAmount(e.target.value)} />
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
                            onClick={handlePinata}  // Corrected usage
                        >
                            Upload to IPFS
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
                </div>

                <div className={styles.comments}>
                    <div style={{ width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            AI Summary for your research
                        </div>
                    </div>
                    <textarea
                        style={{ padding: "10px", maxHeight: "70vh", margin: "0 30px", height: "100%", width: "100%" }}
                    >
                        hello
                    </textarea>
                </div>
            </div>
        </>
    );
}
