export default function checkLandscape(): boolean {
    return typeof window !== 'undefined' ? window.innerHeight >= window.innerWidth : false;
}
