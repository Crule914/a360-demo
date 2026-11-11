// @ts-nocheck
import React from 'react';
import {
  User,
  Calendar,
  CheckSquare,
  TrendingUp,
  Shield,
  MessageSquare,
  ListTodo,
  LineChart,
  Mail,
  Users,
  Clock,
  BarChart3,
  FileText,
  AlertTriangle,
  Target,
  Presentation,
  Database,

  Gift,
  Calculator,
  Zap,
  Lightbulb } from
'lucide-react';

export const getCanvasItemIcon = (type: string): React.ReactNode => {
  switch (type) {
    case 'client_snapshot':
      return <User className="h-4 w-4" />;
    case 'meeting_prep':
      return <CheckSquare className="h-4 w-4" />;
    case 'meeting_summary':
      return <FileText className="h-4 w-4" />;
    case 'meeting_agenda':
      return;
    case 'agenda':
      return <FileText className="h-4 w-4" />;
    case 'agenda_review':
      return <Presentation className="h-4 w-4" />;
    case 'portfolio_overview':
      return <TrendingUp className="h-4 w-4" />;
    case 'compliance_overview':
    case 'compliance_review':
      return <Shield className="h-4 w-4" />;
    case 'calendar_view':
    case 'day_view_calendar':
    case 'calendar_dashboard':
      return <Calendar className="h-4 w-4" />;
    case 'communications_view':
      return <MessageSquare className="h-4 w-4" />;
    case 'tasks_view':
      return <ListTodo className="h-4 w-4" />;
    case 'market_view':
      return <LineChart className="h-4 w-4" />;
    case 'email_draft':
      return <Mail className="h-4 w-4" />;
    case 'daily_highlights':
      return <BarChart3 className="h-4 w-4" />;
    case 'market_article':
      return <TrendingUp className="h-4 w-4" />;
    case 'market_insight_detail':
      return <TrendingUp className="h-4 w-4" />;
    case 'single_task':
      return <CheckSquare className="h-4 w-4" />;
    case 'single_communication':
      return <MessageSquare className="h-4 w-4" />;
    case 'client_overview':
      return <Users className="h-4 w-4" />;
    case 'client_detail':
      return <User className="h-4 w-4" />;
    case 'clients_with_upcoming_meetings':
      return <Clock className="h-4 w-4" />;
    case 'communications_overview':
      return <MessageSquare className="h-4 w-4" />;
    case 'tasks_overview':
      return <CheckSquare className="h-4 w-4" />;
    case 'market_overview':
      return <TrendingUp className="h-4 w-4" />;
    case 'todays_review_meetings':
      return <Users className="h-4 w-4" />;
    case 'todays_tasks':
      return <CheckSquare className="h-4 w-4" />;
    case 'market_impact_insights':
      return <TrendingUp className="h-4 w-4" />;
    case 'daily_highlights':
      return <BarChart3 className="h-4 w-4" />;
    case 'dashboard_this_week':
      return <Calendar className="h-4 w-4" />;
    case 'dashboard_next_week':
      return <Clock className="h-4 w-4" />;
    case 'supporting_material_portfolio':
      return <TrendingUp className="h-4 w-4" />;
    case 'supporting_material_planning':
      return <CheckSquare className="h-4 w-4" />;
    case 'supporting_material_tax':
      return <FileText className="h-4 w-4" />;
    case 'supporting_material_compliance':
      return <Shield className="h-4 w-4" />;
    case 'supporting_material_market':
      return <LineChart className="h-4 w-4" />;
    case 'in_a_minute_briefing':
      return <Clock className="h-4 w-4" />;
    case 'goals_analysis':
      return <Target className="h-4 w-4" />;
    case 'household_overview':
      return <User className="h-4 w-4" />;
    case 'client_crm_data':
      return <Database className="h-4 w-4" />;
    case 'household_birthdays':
      return <Gift className="h-4 w-4" />;
    case 'tax_prep':
      return <Calculator className="h-4 w-4" />;
    case 'uploaded_files':
    case 'document_upload_status':
      return <FileText className="h-4 w-4" />;
    case 'last_meeting_summary':
      return <FileText className="h-4 w-4" />;
    case 'landing_daily_briefing':
      return <Calendar className="h-4 w-4" />;
    case 'landing_client_data_quality':
    case 'household_readiness':
      return <Zap className="h-4 w-4" />;
    case 'landing_potential_meetings':
      return <Users className="h-4 w-4" />;
    case 'landing_meeting_insights':
      return <Lightbulb className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

export const getCanvasItemTitle = (type: string, clientName?: string, taskData?: any, meetingType?: string): string => {
  // Extract client name from nested structure if provided in taskData
  const extractedClientName = clientName || taskData?.client?.name || taskData?.name || taskData?.clientName;

  switch (type) {
    case 'client_snapshot':
      return 'Client Overview';
    case 'meeting_prep':
      return 'Meeting Preparation';
    case 'meeting_summary':
      return 'Review Summary';
    case 'meeting_agenda':
    case 'agenda':
      if (meetingType) {
        const formatted = meetingType.includes(' ') ? meetingType :
        meetingType === 'review' ? 'Review' :
        meetingType === 'planning' ? 'Planning' :
        meetingType === 'compliance' ? 'Compliance' :
        meetingType === 'onboarding' ? 'Onboarding' :
        meetingType;
        return `Agenda for ${formatted}`;
      }
      return 'Agenda for Annual Review';
    case 'agenda_review':
      return 'Client Review';
    case 'portfolio_overview':
      return 'Portfolio Analysis';
    case 'compliance_overview':
    case 'compliance_review':
      return 'Compliance Review';
    case 'calendar_view':
    case 'day_view_calendar':
      return 'Meeting Schedule';
    case 'calendar_dashboard':
      return 'Meeting Calendar';
    case 'communications_view':
      return 'Communications';
    case 'tasks_view':
      return 'Tasks & To-Dos';
    case 'market_view':
      return 'Market Insights';
    case 'email_draft':
      return extractedClientName ? `Email Draft - ${extractedClientName}` : 'Email Draft';
    case 'daily_highlights':
      return 'Daily Dashboard';
    case 'market_article':
      return 'Market Article';
    case 'market_insight_detail':
      return 'Market Insight Detail';
    case 'single_task':
      return taskData?.title ? `Task: ${taskData.title}` : 'Task Details';
    case 'single_communication':
      return extractedClientName ? `Communication Details - ${extractedClientName}` : 'Communication Details';
    case 'client_overview':
      return 'Client Directory';
    case 'client_detail':
      return extractedClientName ? `${extractedClientName} - Client Details` : 'Client Details';
    case 'clients_with_upcoming_meetings':
      return 'Clients with Upcoming Meetings';
    case 'communications_overview':
      return 'Communications Center';
    case 'tasks_overview':
      return 'Task Manager';
    case 'market_overview':
      return 'Market Insights';
    case 'todays_review_meetings':
      return 'Today\'s Review Meetings';
    case 'todays_tasks':
      return 'Today\'s Tasks';
    case 'market_impact_insights':
      return 'Market Impact Insights';
    case 'daily_highlights':
      return 'Daily Dashboard';
    case 'dashboard_this_week':
      return 'This Week\'s Dashboard';
    case 'dashboard_next_week':
      return 'Next Week\'s Preview';
    case 'supporting_material_portfolio':
      return 'Portfolio Analysis';
    case 'supporting_material_planning':
      return 'Financial Planning';
    case 'supporting_material_tax':
      return 'Tax Strategies';
    case 'supporting_material_compliance':
      return 'Compliance & Estate';
    case 'supporting_material_market':
      return 'Market Context';
    case 'in_a_minute_briefing':
      return 'In-a-Minute Briefing';
    case 'goals_analysis':
      return 'Goals Analysis';
    case 'household_overview':
      return 'Household Overview';
    case 'client_crm_data':
      return 'Client CRM Data';
    case 'household_birthdays':
      return 'Household Birthdays';
    case 'tax_prep':
      return extractedClientName ? `Tax Preparation - ${extractedClientName}` : 'Tax Preparation';
    case 'uploaded_files':
    case 'document_upload_status':
      return 'Uploaded Documents';
    case 'last_meeting_summary':
      return 'Last Meeting Summary';
    case 'landing_daily_briefing':
      return 'Upcoming Meeting Preps';
    case 'landing_client_data_quality':
    case 'household_readiness':
      return 'Household Meeting Readiness';
    case 'landing_potential_meetings':
      return 'Clients Due for Reviews';
    case 'landing_meeting_insights':
      return 'Meeting Insights';
    default:
      return 'Canvas Item';
  }
};