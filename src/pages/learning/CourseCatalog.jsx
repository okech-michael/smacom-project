import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, GraduationCap, Clock, Users, Star } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'waste_management', label: 'Waste Management' },
  { value: 'composting', label: 'Composting' },
  { value: 'biogas', label: 'Biogas' },
  { value: 'recycling', label: 'Recycling' },
  { value: 'organic_farming', label: 'Organic Farming' },
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'circular_economy', label: 'Circular Economy' },
  { value: 'environmental_science', label: 'Environmental Science' },
];

export default function CourseCatalog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses-catalog'],
    queryFn: () => apiClient.entities.Course.filter({ is_published: true }, '-created_date', 50),
  });

  const filtered = useMemo(() => {
    let result = courses;
    if (category !== 'all') result = result.filter(c => c.category === category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
    }
    return result;
  }, [courses, category, search]);

  return (
    <div>
      <PageHeader title="Learning Center" description="Expand your knowledge in sustainability and waste management." />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No courses found" description="New courses are added regularly." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(course => (
            <Link key={course.id} to={`/learning/course/${course.id}`}>
              <Card className="h-full hover:shadow-md transition-all group cursor-pointer">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <GraduationCap className="w-10 h-10 text-primary/30" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] capitalize">{course.category?.replace('_', ' ')}</Badge>
                    {course.is_free && <Badge className="text-[10px] bg-primary/10 text-primary border-0">Free</Badge>}
                    {course.difficulty && <Badge variant="outline" className="text-[10px] capitalize">{course.difficulty}</Badge>}
                  </div>
                  <h3 className="text-sm font-semibold line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      {course.duration_hours && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration_hours}h</span>}
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.total_enrollments || 0}</span>
                    </div>
                    {!course.is_free && <span className="font-semibold text-foreground">KES {course.price?.toLocaleString()}</span>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}