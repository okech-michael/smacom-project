import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['waste_management', 'composting', 'biogas', 'recycling', 'organic_farming', 'sustainability', 'circular_economy', 'environmental_science'];

export default function AdminCourses() {
  const queryClient = useQueryClient();
  const [courseOpen, setCourseOpen] = useState(false);
  const [lessonOpen, setLessonOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', category: '', price: '', difficulty: 'beginner', is_free: false });
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', youtube_url: '', module_name: '', duration_minutes: '', order_index: '' });

  const { data: courses = [] } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => apiClient.entities.Course.list('-created_date', 100),
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ['admin-lessons', selectedCourse?.id],
    queryFn: () => apiClient.entities.Lesson.filter({ course_id: selectedCourse?.id }, 'order_index', 50),
    enabled: !!selectedCourse,
  });

  const createCourseMutation = useMutation({
    mutationFn: (data) => apiClient.entities.Course.create({
      ...data,
      price: data.is_free ? 0 : parseFloat(data.price) || 0,
      is_published: true,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      setCourseOpen(false);
      setCourseForm({ title: '', description: '', category: '', price: '', difficulty: 'beginner', is_free: false });
      toast.success('Course created');
    },
  });

  const createLessonMutation = useMutation({
    mutationFn: (data) => apiClient.entities.Lesson.create({
      ...data,
      course_id: selectedCourse.id,
      duration_minutes: parseInt(data.duration_minutes) || 0,
      order_index: parseInt(data.order_index) || lessons.length + 1,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons', selectedCourse?.id] });
      setLessonOpen(false);
      setLessonForm({ title: '', description: '', youtube_url: '', module_name: '', duration_minutes: '', order_index: '' });
      toast.success('Lesson added');
    },
  });

  return (
    <div>
      <PageHeader
        title="Course Management"
        description="Create and manage courses and lessons."
        actions={
          <Dialog open={courseOpen} onOpenChange={setCourseOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />New Course</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Course</DialogTitle></DialogHeader>
              <form onSubmit={e => { e.preventDefault(); createCourseMutation.mutate(courseForm); }} className="space-y-4">
                <div className="space-y-2"><Label>Title</Label><Input value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={courseForm.category} onValueChange={v => setCourseForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace('_', ' ')}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select value={courseForm.difficulty} onValueChange={v => setCourseForm(f => ({ ...f, difficulty: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={courseForm.is_free} onCheckedChange={v => setCourseForm(f => ({ ...f, is_free: v }))} />
                  <Label>Free Course</Label>
                </div>
                {!courseForm.is_free && <div className="space-y-2"><Label>Price (KES)</Label><Input type="number" value={courseForm.price} onChange={e => setCourseForm(f => ({ ...f, price: e.target.value }))} /></div>}
                <Button type="submit" className="w-full" disabled={createCourseMutation.isPending}>
                  {createCourseMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Create Course
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">COURSES ({courses.length})</p>
              <div className="space-y-1">
                {courses.map(course => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${selectedCourse?.id === course.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                  >
                    <p className="font-medium truncate">{course.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-[9px] capitalize">{course.category?.replace('_', ' ')}</Badge>
                      {course.is_free ? <Badge className="text-[9px] bg-green-100 text-green-700 border-0">Free</Badge> : <Badge variant="outline" className="text-[9px]">KES {course.price}</Badge>}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedCourse ? (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold">{selectedCourse.title}</h3>
                    <p className="text-xs text-muted-foreground">Lessons</p>
                  </div>
                  <Dialog open={lessonOpen} onOpenChange={setLessonOpen}>
                    <DialogTrigger asChild><Button size="sm"><Plus className="w-3 h-3 mr-1" />Add Lesson</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Add Lesson</DialogTitle></DialogHeader>
                      <form onSubmit={e => { e.preventDefault(); createLessonMutation.mutate(lessonForm); }} className="space-y-4">
                        <div className="space-y-2"><Label>Title</Label><Input value={lessonForm.title} onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Description</Label><Textarea value={lessonForm.description} onChange={e => setLessonForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
                        <div className="space-y-2"><Label>YouTube URL</Label><Input value={lessonForm.youtube_url} onChange={e => setLessonForm(f => ({ ...f, youtube_url: e.target.value }))} placeholder="https://youtube.com/watch?v=..." /></div>
                        <div className="space-y-2"><Label>Module Name</Label><Input value={lessonForm.module_name} onChange={e => setLessonForm(f => ({ ...f, module_name: e.target.value }))} placeholder="e.g. Introduction" /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>Duration (min)</Label><Input type="number" value={lessonForm.duration_minutes} onChange={e => setLessonForm(f => ({ ...f, duration_minutes: e.target.value }))} /></div>
                          <div className="space-y-2"><Label>Order</Label><Input type="number" value={lessonForm.order_index} onChange={e => setLessonForm(f => ({ ...f, order_index: e.target.value }))} /></div>
                        </div>
                        <Button type="submit" className="w-full" disabled={createLessonMutation.isPending}>
                          {createLessonMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Add Lesson
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                {lessons.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No lessons yet. Add the first lesson.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Video</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lessons.map((lesson, i) => (
                        <TableRow key={lesson.id}>
                          <TableCell>{lesson.order_index || i + 1}</TableCell>
                          <TableCell className="font-medium">{lesson.title}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{lesson.module_name || '-'}</TableCell>
                          <TableCell className="text-xs">{lesson.duration_minutes || '-'}m</TableCell>
                          <TableCell>{lesson.youtube_url ? <Badge variant="secondary" className="text-[9px]">Has video</Badge> : <span className="text-xs text-muted-foreground">No video</span>}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="flex items-center justify-center min-h-[300px]">
              <CardContent className="text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Select a course to manage its lessons.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}