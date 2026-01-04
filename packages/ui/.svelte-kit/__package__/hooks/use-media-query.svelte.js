import { onMount } from 'svelte';
export function useMediaQuery(query) {
    let matches = $state(false);
    onMount(() => {
        const media = window.matchMedia(query);
        matches = media.matches;
        const listener = (e) => {
            matches = e.matches;
        };
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    });
    return {
        get value() { return matches; }
    };
}
