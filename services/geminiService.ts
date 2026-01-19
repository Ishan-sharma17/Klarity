import { GoogleGenAI } from "@google/genai";
import { Task, User, Priority } from "../types.ts";

// Safely access process.env.API_KEY or default to empty string
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';

let ai: GoogleGenAI | null = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.warn("GoogleGenAI failed to initialize. Check API Key.", error);
}

const MODEL_NAME = 'gemini-3-flash-preview';

export interface MorningBrief {
  headline: string;
  subHeadline: string;
  calendar: {
    narrative: string;
    countLabel: string; // e.g. "2 New Invitations"
  };
  mail: {
    narrative: string;
    countLabel: string; // e.g. "39 New Emails"
  };
  tasks: {
    narrative: string;
    countLabel: string; // e.g. "3 Tasks Due"
  };
}

export const chatWithKlarity = async (userMessage: string, contextData: { tasks: Task[], user: User }): Promise<string> => {
  if (!ai) return "I'm running in offline mode (No API Key). I can't analyze your real data right now.";

  try {
    // Construct a system-like prompt with context
    const taskSummary = contextData.tasks.map(t => `- [${t.status}] ${t.title} (${t.priority}) due ${t.dueDate}`).join('\n');
    
    const prompt = `
      You are Klarity AI, a professional task management assistant.
      User Context: ${contextData.user.name} (Role: ${contextData.user.role}).
      Current Burnout Score: ${contextData.user.burnoutScore}/100.
      
      Current Active Tasks:
      ${taskSummary}
      
      User Query: "${userMessage}"
      
      Answer concisely. If the user asks about their workload, reference the tasks. If they seem stressed, offer helpful prioritization advice.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Sorry, I encountered an error connecting to the AI service.";
  }
};

export const generateGhostTasks = async (contextText: string): Promise<Partial<Task>[]> => {
  if (!ai) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    title: "Review deployment logs",
                    tags: ["DevOps", "AI Detected"],
                    isGhost: true,
                    priority: Priority.MEDIUM,
                    weight: 20
                }
            ]);
        }, 1500);
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Based on this work context, identify potential tasks.
      Context: "${contextText}"
      Return a JSON array of task objects with 'title', 'priority' (LOW, MEDIUM, HIGH, CRITICAL), and 'weight' (0-100).`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as Partial<Task>[];
  } catch (error) {
    console.error("Error generating ghost tasks:", error);
    return [];
  }
};

export const summarizeEmailForTask = async (emailBody: string): Promise<{title: string, priority: string, description: string}> => {
  if (!ai) {
    return { title: "Follow up on email", priority: "MEDIUM", description: "Manual follow up" };
  }

  try {
     const response = await ai.models.generateContent({
       model: MODEL_NAME,
       contents: `Analyze this email. Create a concise task title, suggest priority (LOW, MEDIUM, HIGH, CRITICAL), and a 1-sentence description.
       Email: "${emailBody}"
       Return JSON format: { "title": "string", "priority": "string", "description": "string" }`,
       config: {
         responseMimeType: "application/json"
       }
     });
     
     const text = response.text;
     if (!text) return { title: "Follow up on email", priority: "MEDIUM", description: "Manual follow up" };
     return JSON.parse(text);
  } catch (error) {
    console.error("Error summarizing email:", error);
    return { title: "Follow up on email", priority: "MEDIUM", description: "Error processing email" };
  }
};

// --- New Deep Insight Functions ---

export interface WeeklyInsight {
    summary: string;
    completionRate: { value: number; trend: number };
    backlog: { value: number; trend: 'Increasing' | 'Decreasing' | 'Stable' };
    cognitiveLoadLevel: { status: 'Low' | 'Moderate' | 'High'; trend: 'Stable' | 'Increasing' | 'Decreasing' };
    activityLevel: { status: 'Low' | 'Moderate' | 'High'; trend: 'Decreasing' | 'Increasing' | 'Stable' };
    workStyle: { subject: string; A: number; fullMark: number }[];
    cognitiveLoadDistribution: { day: string; deep: number; shallow: number; meetings: number }[];
    anomalies: string[];
    actionItems: string[];
}

export interface ReflectionDraft {
    workloadRating: 'Light' | 'Balanced' | 'Heavy';
    factors: string[];
    summary: string;
    hasBlockers: boolean;
    blockerCauses?: string[];
}

export const generateMorningBrief = async (tasks: Task[], user: User): Promise<MorningBrief> => {
    // Fallback data matching the visual reference style
    const fallback: MorningBrief = {
        headline: `Good morning, ${user.name.split(' ')[0]}!`,
        subHeadline: "Here's your morning brief for Today.",
        calendar: {
            narrative: "Your schedule focuses on balancing oversight of the marketing campaign with final quality check sessions for the upcoming release.",
            countLabel: "4 Review Sessions"
        },
        mail: {
            narrative: "You have several updates regarding the mobile compatibility fixes and new feedback on the user research initiative.",
            countLabel: "15 New Messages"
        },
        tasks: {
            narrative: "With database performance successfully optimized, today's priority shifts to addressing the payment bug and finalizing the design review.",
            countLabel: "9 Active Tasks"
        }
    };

    if (!ai) return fallback;

    try {
        const taskSummary = tasks.slice(0, 10).map(t => `${t.title} (${t.status})`).join('; ');
        
        const prompt = `
            Generate a structured "Start-of-Day Brief" for ${user.name}.
            
            Context:
            - Tasks: ${taskSummary}
            - Role: ${user.role}
            
            OUTPUT FORMAT (JSON):
            {
              "headline": "Good morning, [Name]!",
              "subHeadline": "Here's your morning brief for Today.",
              "calendar": {
                 "narrative": "One sentence summary of the schedule (e.g. 'Your day is packed with...')",
                 "countLabel": "e.g. '5 Meetings'"
              },
              "mail": {
                 "narrative": "One sentence summary of communication load (e.g. 'You have X emails regarding...')",
                 "countLabel": "e.g. '12 New Emails'"
              },
              "tasks": {
                 "narrative": "One sentence summary of key tasks (e.g. 'Today you need to finalize...')",
                 "countLabel": "e.g. '3 Tasks Due'"
              }
            }
            
            Tone: Professional, calm, narrative.
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const text = response.text;
        if (!text) return fallback;

        return JSON.parse(text) as MorningBrief;
    } catch (e) {
        console.error("Brief Gen Error", e);
        return fallback;
    }
};

export const generateWeeklyReport = async (tasks: Task[], user: User): Promise<WeeklyInsight> => {
    // Fallback data matching the user's screenshot
    const mockData: WeeklyInsight = {
        summary: `Performance this week was hindered by a low completion rate of 25%, suggesting difficulty in closing out managerial responsibilities. While the burnout score of ${user.burnoutScore} is moderate, the high number of outstanding tasks indicates potential fragmentation in focus or external blockers.`,
        completionRate: { value: 25, trend: -15 },
        backlog: { value: 9, trend: 'Increasing' },
        cognitiveLoadLevel: { status: 'Moderate', trend: 'Stable' },
        activityLevel: { status: 'Low', trend: 'Decreasing' },
        workStyle: [
            { subject: 'Focus', A: 85, fullMark: 100 },
            { subject: 'Speed', A: 65, fullMark: 100 },
            { subject: 'Collab', A: 70, fullMark: 100 },
            { subject: 'Quality', A: 90, fullMark: 100 },
            { subject: 'Wellness', A: 60, fullMark: 100 },
        ],
        cognitiveLoadDistribution: [
            { day: 'Mon', deep: 3.5, shallow: 3.0, meetings: 2.0 },
            { day: 'Tue', deep: 4.0, shallow: 2.5, meetings: 2.5 },
            { day: 'Wed', deep: 6.0, shallow: 1.0, meetings: 1.0 },
            { day: 'Thu', deep: 1.5, shallow: 4.0, meetings: 4.5 },
            { day: 'Fri', deep: 3.0, shallow: 3.0, meetings: 2.0 },
        ],
        anomalies: [
            "Completion rate is significantly below average (25%)",
            "High task backlog remaining at the end of the work week"
        ],
        actionItems: [
            "Audit the 9 incomplete tasks to delegate at least 3 to direct reports",
            "Implement time-blocking for high-priority managerial decisions to improve focus score.",
            "Schedule a mid-week review to address blockers before they stall task completion."
        ]
    };

    if (!ai) return mockData;

    try {
        const prompt = `
            Analyze this user's work week based on tasks: ${tasks.length} tasks, ${tasks.filter(t => t.status === 'DONE').length} completed.
            User Role: ${user.role}. Burnout Score: ${user.burnoutScore}.
            
            Return a JSON object with this exact structure:
            {
                "summary": "2-3 sentences summarizing performance, focus, and stress.",
                "completionRate": { "value": number, "trend": number },
                "backlog": { "value": number, "trend": "Increasing" | "Decreasing" | "Stable" },
                "cognitiveLoadLevel": { "status": "Low" | "Moderate" | "High", "trend": "Stable" | "Increasing" | "Decreasing" },
                "activityLevel": { "status": "Low" | "Moderate" | "High", "trend": "Decreasing" | "Increasing" | "Stable" },
                "workStyle": [
                    {"subject": "Focus", "A": number, "fullMark": 100},
                    {"subject": "Speed", "A": number, "fullMark": 100},
                    {"subject": "Collab", "A": number, "fullMark": 100},
                    {"subject": "Quality", "A": number, "fullMark": 100},
                    {"subject": "Wellness", "A": number, "fullMark": 100}
                ],
                "cognitiveLoadDistribution": [
                   { "day": "Mon", "deep": number, "shallow": number, "meetings": number },
                   ... (Tue-Fri)
                ],
                "anomalies": ["string", "string"],
                "actionItems": ["string", "string", "string"]
            }
        `;
        
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const text = response.text;
        if (!text) return mockData;
        
        const aiData = JSON.parse(text);
        
        // Merge AI text data with the structured mock chart data for robustness
        return {
            ...mockData,
            ...aiData
        };

    } catch (e) {
        console.error("Reflection Gen Error", e);
        return mockData;
    }
};

export const generateReflectionDraft = async (tasks: Task[], user: User): Promise<ReflectionDraft> => {
    // Default fallback
    const fallback: ReflectionDraft = {
        workloadRating: 'Balanced',
        factors: ['Task complexity'],
        summary: 'A standard week with steady progress.',
        hasBlockers: false,
        blockerCauses: []
    };

    if (!ai) return { ...fallback, hasBlockers: true, blockerCauses: ['External dependencies'] };

    try {
        const prompt = `
            Analyze the user's weekly workload for a self-reflection check-in.
            Data: ${tasks.length} tasks, ${user.burnoutScore} burnout score.
            
            1. Identify 3 key factors (e.g., 'Meetings', 'Context switching', 'Unplanned work') that likely influenced them.
            2. Determine if workload was 'Light', 'Balanced', or 'Heavy'.
            3. Determine if there are potential blockers (true/false) based on overdue tasks or low completion rate.
            4. If blockers exist, suggest 1-2 probable causes (e.g. 'Waiting on review', 'Unclear requirements', 'Technical debt').
            
            Return JSON: { 
                "workloadRating": "Light" | "Balanced" | "Heavy", 
                "factors": ["string", "string"], 
                "summary": "string", 
                "hasBlockers": boolean,
                "blockerCauses": ["string"]
            }
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const text = response.text;
        if (!text) return fallback;

        return JSON.parse(text) as ReflectionDraft;
    } catch (error) {
        console.error("Reflection Draft Error", error);
        return fallback;
    }
}