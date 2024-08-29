import styles from "../app/styles.module.css";
import Image from 'next/image'
import logo from "../assets/medicalchain_logo.png";

export default function Header() {
    return (
        <>
            <div className={styles.Header}>
                <div className={styles.HeaderChild1}>

                    <Image
                        src={logo}
                        width={100}
                        height={70}
                    />
                    <div>About</div>
                    <div>Contact</div>

                </div>
                <div className={styles.HeaderChild2}>
                    <span > wallet address</span>
                    <button className={styles.ConnectButton}>Connect</button>
                </div>
            </div >
        </>
    );
}