import styles from "./styles.module.css";
import Image from 'next/image'
import paper from "../assets/paperPhoto.png"
export default function Home() {
  return (
    <>
      <div style={{ display: "flex", gap: 20, padding: "10px 20px", }}>
        <div>
          <input style={{ width: 600, height: 30 }} placeholder="Search"></input>
        </div>
        <button style={{ left: "36vw" }} className={styles.ConnectButton}>Upload</button>

      </div>

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
