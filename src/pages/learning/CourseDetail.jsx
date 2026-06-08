import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Check, Lock, Clock, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CourseDetail() {
  const courseId = window.location.pathname.split('/').pop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeLesson, setActiveLesson] = useState(null);

  const { data: courses = [] } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => apiClient.entities.Course.filter({ id: courseId }),
    enabled: !!courseId,
  });
  const course = courses[0];

  const { data: lessons = [] } = useQuery({
    queryKey: ['course-lessons', courseId],
    queryFn: () => apiClient.entities.Lesson.filter({ course_id: courseId }, 'order_index', 50),
    enabled: !!courseId,
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['my-enrollment', courseId],
    queryFn: () => apiClient.entities.Enrollment.filter({ course_id: courseId, user_id: user?.id }),
    enabled: !!courseId && !!user?.id,
  });
  const enrollment = enrollments[0];

  const enrollMutation = useMutation({
    mutationFn: async () => {
      await apiClient.entities.Enrollment.create({
        course_id: courseId,
        user_id: user.id,
        status: 'active',
        completed_lessons: [],
        progress_percent: 0,
      });
      await apiClient.entities.Course.update(courseId, {
        total_enrollments: (course.total_enrollments || 0) + 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollment', courseId] });
      toast.success('Enrolled successfully');
    },
  });

  const markCompleteMutation = useMutation({
    mutationFn: async (lessonId) => {
      const completedLessons = [...(enrollment.completed_lessons || [])];
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }
      const progress = Math.round((completedLessons.length / lessons.length) * 100);
      await apiClient.entities.Enrollment.update(enrollment.id, {
        completed_lessons: completedLessons,
        progress_percent: progress,
        status: progress >= 100 ? 'completed' : 'active',
        certificate_issued: progress >= 100,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollment', courseId] });
      toast.success('Lesson completed');
    },
  });

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1` : null;
  };

  if (!course) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin" /></div>;

  const currentLesson = activeLesson || lessons[0];
  const embedUrl = currentLesson ? getYouTubeEmbedUrl(currentLesson.youtube_url) : null;

  return (
    <div>
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />Back to Courses
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video player */}
          {embedUrl ? (
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                key={embedUrl}
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentLesson.title}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="aspect-video rounded-xl bg-muted flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-muted-foreground/10 flex items-center justify-center">
                <Play className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">Video not available for this lesson</p>
              <p className="text-muted-foreground/60 text-xs">Check back later or contact the instructor</p>
            </div>
          )}

          {currentLesson && (
            <div className="space-y-2">
              <h2 className="text-lg font-bold">{currentLesson.title}</h2>
              {currentLesson.description && <p className="text-sm text-muted-foreground">{currentLesson.description}</p>}
              {currentLesson.content && <div className="prose prose-sm max-w-none text-sm text-muted-foreground">{currentLesson.content}</div>}
              {enrollment && (
                <Button
                  size="sm"
                  variant={enrollment.completed_lessons?.includes(currentLesson.id) ? 'secondary' : 'default'}
                  onClick={() => markCompleteMutation.mutate(currentLesson.id)}
                  disabled={markCompleteMutation.isPending || enrollment.completed_lessons?.includes(currentLesson.id)}
                >
                  <Check className="w-4 h-4 mr-1" />
                  {enrollment.completed_lessons?.includes(currentLesson.id) ? 'Completed' : 'Mark Complete'}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{course.title}</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="capitalize text-[10px]">{course.category?.replace('_', ' ')}</Badge>
                {course.difficulty && <Badge variant="outline" className="capitalize text-[10px]">{course.difficulty}</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {course.duration_hours && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration_hours}h</span>}
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.total_enrollments || 0} enrolled</span>
              </div>

              {!enrollment ? (
                <Button className="w-full" onClick={() => enrollMutation.mutate()} disabled={enrollMutation.isPending}>
                  {enrollMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {course.is_free ? 'Enroll Free' : `Enroll - KES ${course.price?.toLocaleString()}`}
                </Button>
              ) : (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{enrollment.progress_percent || 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${enrollment.progress_percent || 0}%` }} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Lessons ({lessons.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {lessons.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No lessons yet.</p>
              ) : (
                <div className="space-y-1">
                  {lessons.map((lesson, idx) => {
                    const isCompleted = enrollment?.completed_lessons?.includes(lesson.id);
                    const isLocked = !enrollment && !lesson.is_free_preview;
                    const isActive = currentLesson?.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !isLocked && setActiveLesson(lesson)}
                        disabled={isLocked}
                        className={`w-full text-left flex items-center gap-3 p-2 rounded-lg text-xs transition-colors ${
                          isActive ? 'bg-primary/10 text-primary' : isLocked ? 'opacity-50' : 'hover:bg-muted'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-semibold ${
                          isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          {isCompleted ? <Check className="w-3 h-3" /> : isLocked ? <Lock className="w-3 h-3" /> : idx + 1}
                        </div>
                        <span className="truncate">{lesson.title}</span>
                        {lesson.duration_minutes && <span className="text-muted-foreground ml-auto flex-shrink-0">{lesson.duration_minutes}m</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}