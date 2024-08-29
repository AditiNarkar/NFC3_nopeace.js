import styles from "../styles.module.css";
import Image from 'next/image'

export default function Preview() {
    const haveAccess = true

    return (
        <>
            {(haveAccess) ?
                <div className={styles.previewContainer}>
                    <div className={styles.paperPreview}>
                    </div>
                    <div className={styles.getAccess}>
                        <div style={{ display: "flex", justifyContent: "center", fontWeight: 600 }}>Title</div>
                        <div>Authors:</div>
                        <div>Posted By:</div>
                        <div>Keywords:</div>
                        <div>Access Fee:</div>
                        <div>Current Win Prize:</div>
                        <button style={{ width: "100%" }} className={styles.ConnectButton}>Stake Contribution</button>
                    </div>
                </div>
                :


                <div className={styles.previewContainer}>
                    <div className={styles.paperPreview}>
                    </div>
                    <div className={styles.getAccess}>
                        <div style={{ display: "flex", justifyContent: "center", fontWeight: 600 }}>Title</div>
                        <div>Authors:</div>
                        <div>Posted By:</div>
                        <div>Keywords:</div>
                        <div>Access Fee:</div>

                        <button style={{ width: "100%" }} className={styles.ConnectButton}>Get Access</button>
                    </div>
                </div>
            }
        </>
    );
}