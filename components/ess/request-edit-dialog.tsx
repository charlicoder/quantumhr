'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const editRequestSchema = z.object({
  field: z.string().min(1, 'Please select a field to edit'),
  currentValue: z.string().min(1, 'Current value is required'),
  requestedValue: z.string().min(1, 'Requested value is required'),
  reason: z.string().min(10, 'Please provide a detailed reason (minimum 10 characters)'),
});

type EditRequestFormValues = z.infer<typeof editRequestSchema>;

interface RequestEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestEditDialog({ open, onOpenChange }: RequestEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditRequestFormValues>({
    resolver: zodResolver(editRequestSchema),
    defaultValues: {
      field: '',
      currentValue: '',
      requestedValue: '',
      reason: '',
    },
  });

  const onSubmit = async (data: EditRequestFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Edit request submitted successfully');
      toast.info('Your request will be reviewed by HR');

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit edit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request Profile Edit</DialogTitle>
          <DialogDescription>
            Submit a request to update your profile information. Your request will be reviewed by HR.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="field"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field to Edit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="phone">Phone Number</SelectItem>
                      <SelectItem value="address">Address</SelectItem>
                      <SelectItem value="emergency_contact">Emergency Contact</SelectItem>
                      <SelectItem value="marital_status">Marital Status</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter current value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestedValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter new/updated value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Change</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please explain why you need this change..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
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
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
