import React from 'react';
import style from './style.module.scss';

import LeftCard from './LeftCard';
import RightCard from './RightCard';
import FormCard from './FormCard';

const Layout = React.memo(({ children }) => <section className={style.profileCard}>{children}</section>);

export { Layout, LeftCard, RightCard, FormCard };
