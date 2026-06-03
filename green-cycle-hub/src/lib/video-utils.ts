/**
 * Extract YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Try youtu.be short format
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Try youtube.com/watch?v= format
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // Try youtube.com/shorts/ format
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  // Try already-embed format
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // Try direct video ID (if already extracted)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

  return null;
}

/**
 * Watch history entry for tracking video progress
 */
export interface WatchHistoryEntry {
  courseId: string;
  videoId: string;
  title: string;
  watchedAt: string; // ISO timestamp
  duration: number; // in seconds
  completionPercentage: number; // 0-100
}

/**
 * Progress tracking for a course
 */
export interface CourseProgress {
  courseId: string;
  title: string;
  startedAt: string; // ISO timestamp
  completionPercentage: number; // 0-100
  lastWatchedAt: string; // ISO timestamp
  watchHistory: WatchHistoryEntry[];
  isCompleted: boolean;
}

const WATCH_HISTORY_KEY = 'smacom_watch_history';
const COURSE_PROGRESS_KEY = 'smacom_course_progress';

/**
 * Get all watch history from local storage
 */
export function getWatchHistory(): WatchHistoryEntry[] {
  try {
    const data = localStorage.getItem(WATCH_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Get all course progress from local storage
 */
export function getCourseProgress(): CourseProgress[] {
  try {
    const data = localStorage.getItem(COURSE_PROGRESS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Track when a user starts watching a video
 */
export function recordVideoStart(courseId: string, videoId: string, title: string) {
  // Update or create course progress
  const progresses = getCourseProgress();
  let courseProgress = progresses.find(p => p.courseId === courseId);

  if (!courseProgress) {
    courseProgress = {
      courseId,
      title,
      startedAt: new Date().toISOString(),
      completionPercentage: 0,
      lastWatchedAt: new Date().toISOString(),
      watchHistory: [],
      isCompleted: false,
    };
    progresses.push(courseProgress);
  } else {
    courseProgress.lastWatchedAt = new Date().toISOString();
  }

  localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(progresses));

  // Record watch history entry
  const history = getWatchHistory();
  history.push({
    courseId,
    videoId,
    title,
    watchedAt: new Date().toISOString(),
    duration: 0, // Will be updated if we implement time-tracking
    completionPercentage: 0,
  });

  localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
}

/**
 * Update course completion percentage
 */
export function updateCourseProgress(courseId: string, completionPercentage: number) {
  const progresses = getCourseProgress();
  const courseProgress = progresses.find(p => p.courseId === courseId);

  if (courseProgress) {
    courseProgress.completionPercentage = Math.min(100, completionPercentage);
    courseProgress.isCompleted = completionPercentage >= 100;
    courseProgress.lastWatchedAt = new Date().toISOString();
    localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(progresses));
  }
}

/**
 * Get progress for a specific course
 */
export function getCourseProgressById(courseId: string): CourseProgress | null {
  const progresses = getCourseProgress();
  return progresses.find(p => p.courseId === courseId) || null;
}

/**
 * Get watch history for a specific course
 */
export function getCourseWatchHistory(courseId: string): WatchHistoryEntry[] {
  const history = getWatchHistory();
  return history.filter(h => h.courseId === courseId);
}

/**
 * Clear all progress data (for testing/reset)
 */
export function clearAllProgress() {
  localStorage.removeItem(WATCH_HISTORY_KEY);
  localStorage.removeItem(COURSE_PROGRESS_KEY);
}

/**
 * Get estimated completion percentage based on watch history
 */
export function getEstimatedProgress(courseId: string): number {
  const history = getCourseWatchHistory(courseId);
  if (history.length === 0) return 0;

  // Simple calculation: 20% per video watched, capped at 100%
  return Math.min(100, history.length * 20);
}
