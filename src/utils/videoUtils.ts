// ─────────────────────────────────────────────────────────────────
//  src/utils/videoUtils.ts
//  Helpers for detecting and embedding video URLs.
// ─────────────────────────────────────────────────────────────────

import type { VideoEmbedInfo } from '@/types';

/**
 * Detects the video platform from a URL and returns the appropriate
 * embed information object, or null if the URL is not recognised.
 */
export const getVideoEmbedInfo = (url: string): VideoEmbedInfo | null => {
  if (!url) return null;
  const str = url.toLowerCase();

  // Native HTML5 video files
  if (str.endsWith('.mp4') || str.endsWith('.webm') || str.endsWith('.ogg')) {
    return { type: 'html5', url };
  }

  // YouTube (standard + short URLs)
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
  );
  if (ytMatch?.[1]) {
    return { type: 'youtube', url: `https://www.youtube.com/embed/${ytMatch[1]}` };
  }

  // Google Drive
  const gDriveMatch = url.match(
    /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([\w-]+)/i
  );
  if (gDriveMatch?.[1]) {
    return { type: 'gdrive', url: `https://drive.google.com/file/d/${gDriveMatch[1]}/preview` };
  }

  return null;
};
