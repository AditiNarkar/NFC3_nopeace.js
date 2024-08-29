import styles from "../styles.module.css";

export default function Profile() {
    return (
        <>
            <div style={{ display: "grid", padding: "50px 100px", gridTemplateColumns: "25% 25% 25% 25%" }}>
                <div style={{ backgroundColor: "#f0f8ff5c", height: 70, margin: 5, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", flexDirection: "column", alignItems: "center", gridColumnStart: 1, gridColumnEnd: 4 }}>
                    <div >Wallet Address: 09876543456789</div>
                    <div >Author Name: Manas mishra</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, flexDirection: "column", alignItems: "center" }}>
                    <div>8 MCT Balance</div>
                    <div>
                        <button style={{ width: "100%", border: "1px solid white" }} className={styles.ConnectButton}>Request MCT</button>
                    </div>
                </div>

                <div style={{ backgroundColor: "#f0f8ff5c", height: 70, margin: 5, display: "flex", flexWrap: "wrap", gap: 10, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <div>Total Earnings</div>
                    <div>8 MCT</div>
                </div>

                <div style={{ backgroundColor: "#f0f8ff5c", height: 70, margin: 5, display: "flex", flexWrap: "wrap", gap: 10, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <div>Pending Stake Amount</div>
                    <div>8 MCT</div>
                </div>

                <div style={{ backgroundColor: "#f0f8ff5c", height: 70, margin: 5, display: "flex", flexWrap: "wrap", gap: 10, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <div>Approved Stake Amount</div>
                    <div>8 MCT</div>
                </div>

                <div style={{ backgroundColor: "#f0f8ff5c", height: 70, margin: 5, display: "flex", flexWrap: "wrap", gap: 10, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <div>Rejected Stake Amount</div>
                    <div>8 MCT</div>
                </div>

                <div style={{ height: 70, margin: 5, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", flexDirection: "column", alignItems: "center", gridColumnStart: 1, gridColumnEnd: 5 }}>
                    <div >Access Discount Obtained</div>
                    <div >6%</div>
                </div>

            </div>
        </>
    );
}