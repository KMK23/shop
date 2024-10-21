import React from "react";
import styles from "./Footer.module.scss";
import { Link } from "react-router-dom";
import { VscGithub } from "react-icons/vsc";

function Footer(props) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.contacts}>
          <Link
            to={"https://github.com/KMK23/"}
            target="_blank"
            rel="noopener noreferrer"
            // 새로운 페이지에서 알 수 없음 그래서 보안강화가 된다
          >
            <VscGithub />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
