const mobileStartWidth = 768;
const checkMobile: Function = (): boolean => typeof window !== 'undefined' ? window.innerWidth <= mobileStartWidth : false;

export default checkMobile;
