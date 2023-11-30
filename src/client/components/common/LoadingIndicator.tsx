import styles from '../../scss/LoadingIndicator.module.scss';
import { CSSProperties, FC, useMemo } from 'react';

interface LoadingIndicatorProps {
  size?: number;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ size = 32 }) => {
  const style = useMemo(
    () => ({ '--size': `${size / 16}rem` }) as CSSProperties,
    [size],
  );
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      className={styles.indicator}
      viewBox="0 0 326 326"
      style={style}
    >
      <g transform="matrix(5.84865e-17,0.955157,-0.955157,5.84865e-17,476.766,-147.805)">
        <path d="M340.397,161.863L462.206,232.189C471.488,237.548 477.206,247.452 477.206,258.17L477.206,398.823C477.206,409.541 471.488,419.445 462.206,424.804L340.397,495.13C331.115,500.489 319.679,500.489 310.397,495.13L188.588,424.804C179.306,419.445 173.588,409.541 173.588,398.823L173.588,258.17C173.588,247.452 179.306,237.548 188.588,232.189L310.397,161.863C319.679,156.504 331.115,156.504 340.397,161.863Z" />
      </g>
    </svg>
  );
};
