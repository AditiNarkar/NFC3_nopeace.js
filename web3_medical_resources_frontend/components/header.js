import styles from "../app/styles.module.css";
import Image from 'next/image'

export default function Header() {
    return (
        <>
            <div className={styles.Header}>
                <div className={styles.HeaderChild1}>

                    {/* <Image
                            src={logo}
                            width={70}
                            height={70}
                        /></div> */}
                    <div>About</div>
                    <div>Contact</div>

                </div>
                <div className={styles.HeaderChild2}>
                    <span > Hi! wallet address</span>
                    <button className={styles.ConnectButton}>Connect</button>
                </div>
            </div>
        </>
    );
}