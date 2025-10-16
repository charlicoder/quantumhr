'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Upload } from 'lucide-react';

const documentSchema = z.object({
  name: z.string().min(2, 'Document name is required'),
  category: z.string().min(1, 'Category is required'),
  type: z.string().min(1, 'Type is required'),
  file: z.any().optional(),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadDocumentDialog({ open, onOpenChange }: UploadDocumentDialogProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: '',
      category: '',
      type: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: DocumentFormValues) => {
      const fileSize = selectedFile
        ? selectedFile.size > 1024 * 1024
          ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(selectedFile.size / 1024).toFixed(0)} KB`
        : '0 KB';

      const { error } = await supabase.from('documents').insert({
        name: data.name,
        category: data.category,
        type: data.type,
        size: fileSize,
        uploaded_by_name: `${user?.firstName} ${user?.lastName}` || 'Admin User',
        upload_date: new Date().toISOString(),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Document uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      form.reset();
      setSelectedFile(null);
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload document');
    },
  });

  const onSubmit = async (data: DocumentFormValues) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!form.getValues('name')) {
        form.setValue('name', file.name);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a new document to the document library
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">File</label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                  className="cursor-pointer"
                />
              </div>
              {selectedFile && (
                <p className="text-xs text-muted-foreground">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Employee Handbook 2025.pdf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Company Policy">Company Policy</SelectItem>
                      <SelectItem value="HR Policy">HR Policy</SelectItem>
                      <SelectItem value="Payroll">Payroll</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Policy">Policy</SelectItem>
                      <SelectItem value="Template">Template</SelectItem>
                      <SelectItem value="Form">Form</SelectItem>
                      <SelectItem value="Guideline">Guideline</SelectItem>
                      <SelectItem value="Report">Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Upload className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
