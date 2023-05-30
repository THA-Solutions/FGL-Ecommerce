import React from "react";
import styles from "../styles/PopUp.module.css";

export default function PopUp(props) {
  return props.trigger ? (
    <div className={styles.popup}>
      <div className={styles.popup_inner}>
        {props.children}
        <button
          className={styles.close_btn}
          onClick={() => props.setTrigger(false)}
        >
          OK
        </button> 
      </div>
    </div>
  ) : (
    ""
  );
}
