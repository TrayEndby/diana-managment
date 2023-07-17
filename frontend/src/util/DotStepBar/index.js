import React from 'react';
import PropTypes from 'prop-types';
import style from './style.module.scss';
import { Step_Titles } from '../../constants/parentStep';

const propTypes = {
	steps: PropTypes.array.isRequired,
};

const DotStepBar = (props) => {
	const { steps } = props;
	return (
		<div className={ steps[1] === 0 ? style.root : style.root_second_step }>
			{ steps.map((step, id) => (
				<div style={{width: '33%'}}>
					<div className={style.timeline}>
						<div className={step === 0 ? style.timeline_head_zero : style.timeline_head}>
							<p className={step === 0 ? style.timeline_head_number_zero : style.timeline_head_number}>{id + 1}</p>
						</div>
						<div className={style.timeline_progress} style={{ width: step === 0 ? 0 : step * 10 - 10 + '%' }} />
					</div>
					<p className={style.timeline_title} style={{marginLeft: -Step_Titles[id].length * 4 + 'px'}}>{Step_Titles[id]}</p>
				</div>
			))}
			<div style={{width: '1%'}}>
				<div className={style.timeline}>
					<div className={steps[2] !== 11 ? style.timeline_end_zero : style.timeline_end}>
						<p className={steps[2] !== 11 ? style.timeline_head_number_zero : style.timeline_head_number}>{4}</p>
					</div>
				</div>
				<p className={style.timeline_title} style={{marginLeft: -Step_Titles[3].length * 4 + 'px'}}>{Step_Titles[3]}</p>
			</div>
		</div>
	)
};

DotStepBar.propTypes = propTypes;

export default DotStepBar;