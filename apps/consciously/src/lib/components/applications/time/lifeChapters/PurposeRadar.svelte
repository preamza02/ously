<script lang="ts">
    import type { LifeChapter } from '@ously/core/time/repo/lifeChapter';
    import type { Tag } from '@ously/core/utils/id';
    import ScaleIcon from '@lucide/svelte/icons/scale';

    interface Props {
        lifeChapters: LifeChapter[];
        purposes: Tag[];
    }

    let { lifeChapters, purposes }: Props = $props();

    // Calculate weeks per purpose
    let purposeStats = $derived.by(() => {
        const stats: Record<string, number> = {};
        
        // Initialize all purposes with 0
        purposes.forEach(p => {
            stats[p.id] = 0;
        });

        // Count weeks for each purpose
        lifeChapters.forEach(chapter => {
            const weekCount = chapter.endWeekNumber - chapter.startWeekNumber;
            const primaryTag = chapter.tags?.[0];
            if (primaryTag && stats[primaryTag.id] !== undefined) {
                stats[primaryTag.id] += weekCount;
            }
        });

        return stats;
    });

    // Max weeks for scaling
    let maxWeeks = $derived(Math.max(...Object.values(purposeStats), 1));

    // Filter to only the 5 main purposes (excluding un-purpose)
    let mainPurposes = $derived(purposes.filter(p => p.id !== 'un-purpose').slice(0, 5));

    // SVG drawing parameters
    const cx = 140;
    const cy = 140;
    const maxRadius = 80;
    const labelRadius = 105;

    // Calculate polygon points for a given set of values
    function getPolygonPoints(values: number[]): string {
        return values.map((value, i) => {
            const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
            const radius = (value / maxWeeks) * maxRadius;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    }

    // Get position for label
    function getLabelPosition(index: number, total: number) {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        return {
            x: cx + labelRadius * Math.cos(angle),
            y: cy + labelRadius * Math.sin(angle)
        };
    }

    // Get axis line endpoint
    function getAxisEndpoint(index: number, total: number) {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        return {
            x: cx + maxRadius * Math.cos(angle),
            y: cy + maxRadius * Math.sin(angle)
        };
    }

    let values = $derived(mainPurposes.map(p => purposeStats[p.id] || 0));
    let polygonPoints = $derived(getPolygonPoints(values));
</script>

<div class="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6">
    <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <ScaleIcon class="w-5 h-5 text-purple-500" />
        Purpose Balance
    </h3>

    <div class="flex justify-center">
        <svg viewBox="0 0 280 280" class="w-full max-w-[280px] h-auto">
            <!-- Background circles -->
            {#each [0.25, 0.5, 0.75, 1] as scale}
                <circle
                    cx={cx}
                    cy={cy}
                    r={maxRadius * scale}
                    fill="none"
                    stroke="currentColor"
                    class="text-slate-200 dark:text-slate-700"
                    stroke-width="0.5"
                />
            {/each}

            <!-- Axis lines -->
            {#each mainPurposes as purpose, i}
                {@const endpoint = getAxisEndpoint(i, mainPurposes.length)}
                <line
                    x1={cx}
                    y1={cy}
                    x2={endpoint.x}
                    y2={endpoint.y}
                    stroke="currentColor"
                    class="text-slate-200 dark:text-slate-700"
                    stroke-width="0.5"
                />
            {/each}

            <!-- Data polygon -->
            {#if values.some(v => v > 0)}
                <polygon
                    points={polygonPoints}
                    fill="url(#radarGradient)"
                    stroke="url(#radarStroke)"
                    stroke-width="2"
                    opacity="0.8"
                />
            {/if}

            <!-- Data points -->
            {#each mainPurposes as purpose, i}
                {@const angle = (Math.PI * 2 * i) / mainPurposes.length - Math.PI / 2}
                {@const radius = (values[i] / maxWeeks) * maxRadius}
                {@const x = cx + radius * Math.cos(angle)}
                {@const y = cy + radius * Math.sin(angle)}
                <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill={purpose.color}
                    stroke="white"
                    stroke-width="1.5"
                />
            {/each}

            <!-- Labels -->
            {#each mainPurposes as purpose, i}
                {@const pos = getLabelPosition(i, mainPurposes.length)}
                {@const textAnchor = pos.x < cx - 10 ? 'end' : pos.x > cx + 10 ? 'start' : 'middle'}
                <text
                    x={pos.x}
                    y={pos.y}
                    text-anchor={textAnchor}
                    dominant-baseline="middle"
                    class="text-[9px] font-semibold fill-slate-600 dark:fill-slate-400"
                >
                    {purpose.name}
                </text>
            {/each}

            <!-- Gradients -->
            <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.3" />
                </linearGradient>
                <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#8b5cf6" />
                    <stop offset="100%" stop-color="#3b82f6" />
                </linearGradient>
            </defs>
        </svg>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap justify-center gap-3 mt-4">
        {#each mainPurposes as purpose}
            {@const weeks = purposeStats[purpose.id] || 0}
            <div class="flex items-center gap-1.5 text-xs">
                <span class="w-2 h-2 rounded-full" style="background-color: {purpose.color}"></span>
                <span class="text-slate-600 dark:text-slate-400">{purpose.name}:</span>
                <span class="font-mono font-semibold text-slate-900 dark:text-white">{weeks}w</span>
            </div>
        {/each}
    </div>
</div>
