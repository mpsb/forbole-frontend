import React, { useState } from 'react';

import * as styles from './collapsible.module.css';

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.collapsible}>
      <div className={styles.collapsibleHeader} onClick={toggleCollapse}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span className={isOpen ? styles.arrowDown : styles.arrowRight}></span>
      </div>
      {isOpen && <div className={styles.collapsibleContent}>{children}</div>}
    </div>
  );
};

export default Collapsible;
