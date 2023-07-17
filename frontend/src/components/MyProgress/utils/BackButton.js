import React from 'react';
import { useHistory } from "react-router-dom";
import cn from 'classnames';
import styles from './style.module.scss';

const BackButton = () => {
    let history = useHistory();
    return (
        <div className={cn(styles.backButton)} onClick={() => history.goBack()}>
            Back
        </div>
    )
}

export default BackButton;