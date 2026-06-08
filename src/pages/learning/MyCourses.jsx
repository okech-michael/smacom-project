import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, GraduationCap } from 'lucide-react';

export default function MyCourses() {
  const { user } = useAuth();
  const { data: enrollments = [] } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => apiClient.entities.Enrollment.filter({ user_id: user?.id }, '-created_date', 50),
    enabled: !!user?.id,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['all-courses-for-enrollments'],
    queryFn: () => apiClient.entities.Course.list('-created_date', 200),
  });

  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));

  return (
    <div>
      <PageHeader title="My Courses" description="Track your learning progress." />
      {enrollments.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses enrolled" description="Browse the course catalog to start learning." actionLabel="Browse Courses" onAction={() => window.location.href = '/learning'} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map(enrollment => {
            const course = courseMap[enrollment.course_id];
            if (!course) return null;
            return (
              <Link key={enrollment.id} to={`/learning/course/${enrollment.course_id}`}>
                <Card className="h-full hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold truncate">{course.title}</h3>
                        <Badge variant="secondary" className="text-[10px] capitalize">{course.category?.replace('_', ' ')}</Badge>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{enrollment.status === 'completed' ? 'Completed' : 'In progress'}</span>
                        <span className="font-medium">{enrollment.progress_percent || 0}%</span>
                      </div>
                      <Progress value={enrollment.progress_percent || 0} className="h-1.5" />
                    </div>
                    {enrollment.certificate_issued && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">Certificate Earned</Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}