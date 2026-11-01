import type { IncomingMessage, ServerResponse } from 'http'

// Type definition for Vercel Serverless Function request/response
interface VercelRequest extends IncomingMessage {
  body: any;
  query: { [key: string]: string | string[] };
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: any) => void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return res.status(200).json({
      fallback: true,
      message: 'Gemini API key not configured on server. Used intelligent local heuristic fallback.',
      rationale: 'Timetable generated using multi-factor constraint satisfaction (exam deadlines, topic difficulty, and spaced revision).',
      tips: [
        'Focus on your highest difficulty chapters during early morning energy peaks.',
        'Use the 50-minute deep focus mode for complex mathematical or algorithmic subjects.',
        'Review weak topics first before introducing new syllabus chapters.'
      ],
      motivation: 'Consistency over intensity. One dedicated study session today builds compound mastery for tomorrow.'
    })
  }

  try {
    const { subjects, targetCgpa, mode, studyHours, upcomingExams, weakTopics } = req.body || {}

    const prompt = `
You are an expert academic advisor and cognitive science tutor for SmartStudy AI.
Analyze the following student academic profile and schedule:
- Mode: ${mode || 'Balanced'}
- Daily Available Study Hours: ${studyHours || 4}
- Target CGPA: ${targetCgpa || 'Not specified'}
- Subjects: ${JSON.stringify(subjects || [])}
- Upcoming Exams: ${JSON.stringify(upcomingExams || [])}
- Weak Topics: ${JSON.stringify(weakTopics || [])}

Provide a JSON response with:
1. "rationale": A concise, clear explanation (2-3 sentences) of why this study schedule was allocated the way it was.
2. "tips": Array of 3 specific, high-yield actionable study tips for these exact subjects.
3. "motivation": A punchy, inspiring quote or reminder (1 sentence).
4. "recommendedPriorities": Array of objects { "subject": string, "priorityReason": string }

Return strictly valid JSON with no markdown backticks.
`

    // Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          }
        })
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error('Gemini API Error:', errText)
      return res.status(200).json({
        fallback: true,
        message: 'Gemini API error. Falling back to local optimization.',
        rationale: 'Schedule optimized prioritizing imminent examination deadlines and high-difficulty chapters.',
        tips: [
          'Tackle heavy conceptual topics during your first study block.',
          'Consistently test active recall rather than passive re-reading.',
          'Take scheduled 5-10 minute rest periods to maintain mental endurance.'
        ],
        motivation: 'Success is the sum of small efforts, repeated day in and day out.'
      })
    }

    const data = await response.json()
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Clean response of potential markdown wrapping
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleanJson)

    return res.status(200).json({
      fallback: false,
      ...parsed
    })
  } catch (error: any) {
    console.error('Error generating AI schedule advice:', error)
    return res.status(200).json({
      fallback: true,
      error: error.message,
      rationale: 'Schedule optimized via deterministic spaced repetition and exam priority balancing.',
      tips: [
        'Distribute high-priority study sessions throughout your most alert hours.',
        'Review difficult chapters using practice tests to cement retention.',
        'Adhere strictly to Pomodoro rest intervals to prevent mental fatigue.'
      ],
      motivation: 'Stay disciplined today so your future self can thank you tomorrow.'
    })
  }
}
