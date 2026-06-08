import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Award, Clock, ArrowRight } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function LearnerDashboard({ user }) {
  const { data: enrollments = [] } = useQuery({
    queryKey: ['learner-enrollments'],
    queryFn: () => apiClient.entities.Enrollment.filter({ user_id: user?.id }, '-created_date', 50),
    enabled: !!user?.id,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['all-courses'],
    queryFn: () => apiClient.entities.Course.filter({ is_published: true }, '-created_date', 20),
  });

  const activeCourses = enrollments.filter(e => e.status === 'active').length;
  const completedCourses = enrollments.filter(e => e.status === 'completed').length;
  const certificates = enrollments.filter(e => e.certificate_issued).length;
  const avgProgress = enrollments.length > 0 ? enrollments.reduce((s, e) => s + (e.progress_percent || 0), 0) / enrollments.length : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'Learner'}`}
        description="Continue your learning journey in sustainability."
        actions={
          <Link to="/learning">
            <Button><BookOpen className="w-4 h-4 mr-2" />Browse Courses</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Courses" value={activeCourses} icon={BookOpen} />
        <StatCard title="Completed" value={completedCourses} icon={GraduationCap} />
        <StatCard title="Certificates" value={certificates} icon={Award} />
        <StatCard title="Avg Progress" value={`${avgProgress.toFixed(0)}%`} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Continue Learning</CardTitle>
            <Link to="/learning/my-courses" className="text-xs text-primary hover:underline flex items-center gap-1">
              All courses <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {enrollments.filter(e => e.status === 'active').length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No active courses. Enroll in a course to start learning.</p>
            ) : (
              <div className="space-y-4">
                {enrollments.filter(e => e.status === 'active').slice(0, 4).map(enrollment => {
                  const course = courses.find(c => c.id === enrollment.course_id);
                  return (
                    <div key={enrollment.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">{course?.title || 'Course'}</p>
                        <span className="text-xs text-muted-foreground">{enrollment.progress_percent || 0}%</span>
                      </div>
                      <Progress value={enrollment.progress_percent || 0} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recommended Courses</CardTitle>
            <Link to="/learning" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No courses available yet.</p>
            ) : (
              <div className="space-y-3">
                {courses.slice(0, 4).map(course => (
                  <Link key={course.id} to={`/learning/course/${course.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{course.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{course.difficulty || 'All levels'} - {course.is_free ? 'Free' : `KES ${course.price}`}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}