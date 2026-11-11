// @ts-nocheck
import React from 'react';
import { 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckSquare, 
  FileText, 
  Users, 
  AlertTriangle,
  ClipboardList,
  Calculator,
  Building2,
  Shield,
  BookOpen
} from 'lucide-react';

export const getTaskIcon = (task: { title: string; category?: string; description?: string }): React.ReactNode => {
  const title = task.title?.toLowerCase() || '';
  const category = task.category?.toLowerCase() || '';
  const description = task.description?.toLowerCase() || '';
  
  // Specific task type detection (most specific first)
  if (title.includes('schedule') || title.includes('appointment') || title.includes('meeting')) {
    return <Calendar className="h-4 w-4 text-blue-600" />;
  }
  
  if (title.includes('call') || title.includes('phone') || description.includes('call') || description.includes('phone')) {
    return <Phone className="h-4 w-4 text-green-600" />;
  }
  
  if (title.includes('email') || title.includes('mail') || description.includes('email')) {
    return <Mail className="h-4 w-4 text-purple-600" />;
  }
  
  if (title.includes('review') && (title.includes('annual') || title.includes('quarterly'))) {
    return <ClipboardList className="h-4 w-4 text-blue-600" />;
  }
  
  if (title.includes('rmd') || title.includes('calculation') || title.includes('tax forms')) {
    return <Calculator className="h-4 w-4 text-orange-600" />;
  }
  
  if (title.includes('estate') || title.includes('trust') || description.includes('estate')) {
    return <Building2 className="h-4 w-4 text-indigo-600" />;
  }
  
  if (title.includes('compliance') || title.includes('documentation') || category === 'compliance') {
    return <Shield className="h-4 w-4 text-red-600" />;
  }
  
  if (title.includes('report') || title.includes('document') || title.includes('proposal')) {
    return <FileText className="h-4 w-4 text-gray-600" />;
  }
  
  if (title.includes('research') || title.includes('analysis') || description.includes('analysis')) {
    return <BookOpen className="h-4 w-4 text-teal-600" />;
  }
  
  if (title.includes('message') || title.includes('chat') || description.includes('message')) {
    return <MessageSquare className="h-4 w-4 text-orange-600" />;
  }
  
  // Category-based icons (fallback)
  if (category === 'client_work') {
    return <Users className="h-4 w-4 text-blue-600" />;
  }
  
  if (category === 'compliance') {
    return <Shield className="h-4 w-4 text-red-600" />;
  }
  
  if (category === 'planning') {
    return <ClipboardList className="h-4 w-4 text-green-600" />;
  }
  
  if (category === 'administrative') {
    return <FileText className="h-4 w-4 text-gray-600" />;
  }
  
  // Default task icon
  return <CheckSquare className="h-4 w-4 text-gray-600" />;
};