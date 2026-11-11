// @ts-nocheck
import { TaskData } from "@miq/types/advisor";

export interface TaskPromptResult {
  prompt: string;
  useCanvasUpdate?: boolean;
  canvasType?: string;
  canvasData?: any;
}

export const generateTaskPrompt = (task: TaskData, context: 'completed' | 'action_required' | 'today' = 'action_required'): TaskPromptResult => {
  const clientContext = task.clientName ? ` for ${task.clientName}` : '';
  const taskTitle = task.title || 'task';
  
  // Check if this is a meeting-related task
  const isMeetingTask = task.title.toLowerCase().includes('meeting') ||
    task.title.toLowerCase().includes('appointment') ||
    task.title.toLowerCase().includes('call') ||
    task.title.toLowerCase().includes('preparation') ||
    task.title.toLowerCase().includes('review meeting') ||
    task.title.toLowerCase().includes('consultation') ||
    task.description?.toLowerCase().includes('meeting') ||
    task.description?.toLowerCase().includes('call');

  // For meeting-related tasks, route to meeting preparation
  if (isMeetingTask && task.clientName) {
    return {
      prompt: `Load the meeting preparation${clientContext}`,
      useCanvasUpdate: true,
      canvasType: 'meeting_prep',
      canvasData: { clientName: task.clientName, taskId: task.id }
    };
  }

  // Generate contextual prompts based on task properties and context
  switch (context) {
    case 'completed':
      if (task.category === 'compliance') {
        return { prompt: `Review the completed compliance task: "${taskTitle}"${clientContext}` };
      }
      if (task.category === 'client_work') {
        return { prompt: `Show me the results of the completed task "${taskTitle}"${clientContext}` };
      }
      return { prompt: `Review the completed task "${taskTitle}"${clientContext} and show me the outcomes` };

    case 'action_required':
      if (task.category === 'compliance') {
        return { prompt: `Guide me through completing the compliance task "${taskTitle}"${clientContext}` };
      }
      if (task.category === 'client_work') {
        return { prompt: `Help me complete "${taskTitle}"${clientContext}` };
      }
      if (task.category === 'administrative') {
        return { prompt: `Show me the next steps for "${taskTitle}"${clientContext}` };
      }
      if (task.priority === 'high') {
        return { prompt: `Urgently help me with the high-priority task "${taskTitle}"${clientContext}` };
      }
      return { prompt: `Help me complete the task "${taskTitle}"${clientContext}` };

    case 'today':
      if (task.status === 'completed') {
        return { prompt: `Review today's completed task "${taskTitle}"${clientContext}` };
      }
      if (task.priority === 'high') {
        return { prompt: `Help me prioritize and complete the urgent task "${taskTitle}" due today${clientContext}` };
      }
      return { prompt: `Help me work on today's task "${taskTitle}"${clientContext}` };

    default:
      return { prompt: `Show me details for "${taskTitle}"${clientContext}` };
  }
};

export const generateMeetingTaskPrompt = (task: TaskData): TaskPromptResult => {
  if (task.clientName) {
    return {
      prompt: `Load the meeting preparation for ${task.clientName}`,
      useCanvasUpdate: true,
      canvasType: 'meeting_prep',
      canvasData: { clientName: task.clientName, taskId: task.id }
    };
  }
  return { prompt: `Help me prepare for the meeting: "${task.title}"` };
};