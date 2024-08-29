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
          <div >Title</div>
          <div>Authors:</div>
          <div>Posted By:</div>
        </div>

      </div>
    </>
  );
}
