import React from 'react';
import styles from '../../styles/Buttons.module.css'

function Button({ children, onClick, variant = 'button' }) {
    const classNames = `${styles.buttonBase} ${styles[variant]}`;
  
    return (
      <button className={classNames} onClick={onClick}>
        {children}
      </button>
    );
  }

export default Button;