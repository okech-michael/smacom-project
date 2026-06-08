import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function Certificates() {
  const { user } = useAuth();
  const { data: enrollments = [] } = useQuery({
    queryKey: ['my-certificates'],
    queryFn: () => apiClient.entities.Enrollment.filter({ user_id: user?.id, certificate_issued: true }, '-updated_date', 50),
    enabled: !!user?.id,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['courses-for-certs'],
    queryFn: () => apiClient.entities.Course.list('-created_date', 200),
  });

  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));

  return (
    <div>
      <PageHeader title="My Certificates" description="Certificates earned from completed courses." />
      {enrollments.length === 0 ? (
        <EmptyState icon={Award} title="No certificates yet" description="Complete a course to earn your certificate." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map(enrollment => {
            const course = courseMap[enrollment.course_id];
            return (
              <Card key={enrollment.id} className="overflow-hidden">
                <div className="h-2 bg-primary" />
                <CardContent className="p-5 text-center space-y-3">
                  <Award className="w-12 h-12 text-primary mx-auto" />
                  <h3 className="font-semibold">{course?.title || 'Course'}</h3>
                  <p className="text-xs text-muted-foreground">Completed on {enrollment.updated_date ? format(new Date(enrollment.updated_date), 'MMM d, yyyy') : 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">{user?.full_name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}