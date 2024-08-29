import styles from "../styles.module.css";

export default function Publish() {
    return (
        <>
            <div style={{ fontWeight: 800, padding: "30px", display: "flex", justifyContent: "center" }}>Publish Research</div>
            <div className={styles.contributionFormParent}>
                <div className={styles.contributionForm}>
                    <div style={{ width: "100%" }}>
                        <div>Research Title</div>
                        <input style={{ height: 30, width: "100%" }} type="text"></input>
                    </div>
                    <div style={{ width: "100%" }}>
                        <div>Authors</div>
                        <input style={{ height: 30, width: "100%" }} type="text"></input>
                    </div>
                    <div style={{ width: "100%" }}>
                        <div>Keywords</div>
                        <input style={{ height: 30, width: "100%" }} type="text"></input>
                    </div>

                    <div style={{ width: "100%" }}>
                        <div>Stake Amount (MCT)</div>
                        <input style={{ height: 30, width: "100%" }} type="number"></input>
                    </div>

                    <div style={{ width: "100%" }}>
                        <div>Upload your paper</div>
                        <input style={{ height: 30, width: "100%" }} type="file"></input>
                    </div>

                    <div style={{ width: "100%" }}>
                        <button style={{ width: "100%", border: "1px solid white" }} className={styles.ConnectButton}>Submit</button>

                    </div>
                </div>

                <div className={styles.comments}>
                    <div style={{ width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>AI verification of your pdf</div>
                    </div>
                    <textarea readOnly style={{ padding: "10px", maxHeight: "70vh", margin: "0 30px", height: "100%", width: "100%" }}>hello</textarea>
                </div>
            </div>
        </>
    );
}