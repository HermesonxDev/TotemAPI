import { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from {
      opacity: 0.7;
  }
  to {
      opacity: 1;
  }
`;


export const fadeOut = keyframes`
  from {
      opacity: 1;
  }
  to {
      opacity: 0.7;
  }
`;


export const leftIn = keyframes`
    0% {
        transform: translateX(-100px);
        opacity: 0;
    }

    50% {
        opacity: .3;
    }

    100% {
        transform: translateX(0px);
        opacity: 1;
    }
`;


export const rightIn = keyframes`
    0% {
        transform: translateX(100px);
        opacity: 0;
    }

    50% {
        opacity: .3;
    }

    100% {
        transform: translateX(0px);
        opacity: 1;
    }
`;