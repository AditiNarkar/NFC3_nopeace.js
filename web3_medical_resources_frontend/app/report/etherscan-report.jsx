// pages/transaction-details.js
import React from 'react';
import Image from 'next/image';
// import styles from '../styles/TransactionDetails.module.css'; // Create this CSS file for styling

const TransactionDetails = () => {
    return (
        <div className={styles.container}>
            <h1>Transaction Details</h1>

            <div className={styles.detail}>
                <strong>Transaction Hash:</strong> 0x7be10072ebc3770b4b853b50de2ee67e2b52679ca79e90861b76c3661e3b524
            </div>

            <div className={styles.detail}>
                <strong>Status:</strong> Success
            </div>

            <div className={styles.detail}>
                <strong>Block:</strong> 20639348 (1 Block Confirmation)
            </div>

            <div className={styles.detail}>
                <strong>Timestamp:</strong> Aug-30-2024 05:37:35 AM UTC
            </div>

            <div className={styles.detail}>
                <strong>Transaction Action:</strong> Swap 0.03979046341963 ETH ($100.10) for 12,888,439.349317368226747539 PEPE ($98.47) on 1inch
            </div>

            <div className={styles.detail}>
                <strong>From:</strong> 0x87589306b4B70FdEe62a4bcF1F88AF34ec0Cdbad2
            </div>

            <div className={styles.detail}>
                <strong>To:</strong> Aggregation Router V5 (0x1111111254EEB25477B68fb85Ed929f73A960582)
            </div>

            <div className={styles.detail}>
                <strong>Transfers:</strong>
                <ul>
                    <li>0.03979046341963 ETH From Aggregation Router V5 To 0xE37e799D...71457BD09</li>
                    <li>0.0003979046341963 ETH From 0xE37e799D...71457BD09 To Coinbase: Fees</li>
                    <li>0.0393925587854337 ETH From 0xE37e799D...71457BD09 To Wrapped Ether</li>
                </ul>
            </div>

            <div className={styles.imageContainer}>
                <Image
                    src="/path-to-your-image/image.png" // Place the image in your public directory or adjust the path accordingly
                    alt="Transaction Details"
                    width={800}
                    height={400}
                />
            </div>
        </div>
    );
};

export default TransactionDetails;