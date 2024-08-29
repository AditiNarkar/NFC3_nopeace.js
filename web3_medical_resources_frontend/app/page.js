import styles from "./styles.module.css";
import Image from 'next/image'
import paper from "../assets/paperPhoto.png"
export default function Home() {
  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.paperDetails}>
          <Image
            src={paper}
            width={310}
            height={200}
          ></Image>
          <div style={{ display: "flex", justifyContent: "center", fontWeight: 600 }}>Title</div>
          <div>Posted By:</div>

          <button style={{ width: "100%" }} className={styles.ConnectButton}>View</button>
        </div>

      </div>
    </>
  );
}
