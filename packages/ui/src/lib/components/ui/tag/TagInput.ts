import type { Tag } from '@ously/core/utils/id';

/**
 * TagInput interface for Tag component
 * Uses explicit color for styling instead of hardcoded tailwind classes
 */
export interface TagInput {
    /** Hex color string like '#3b82f6' */
    color: string;
    /** The tag data */
    tag: Tag;
}
