<script lang="ts">
    import LifeChapterApplication from '$lib/components/applications/time/lifeChapters/Application.svelte';
    import ComingSoon from '$lib/components/applications/ComingSoon.svelte';
    import { OuslySeparator } from '@ously/ui';
    import SEO from '$lib/components/SEO.svelte';
</script>

<SEO title="Time Management" description="Manage your time intentionally." />

<LifeChapterApplication id="life-in-weeks" />
<OuslySeparator />
<ComingSoon appId="time-budgeting" />
