import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Exam } from '../../types'
import {
  GraduationCap,
  Plus,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  CheckSquare,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react'
import { format, parseISO, differenceInDays } from 'date-fns'

export const ExamCountdown: React.FC = () => {
  const { exams, addExam, updateExam, deleteExam, subjects } = useApp()
  const [showModal, setShowModal] = useState(false)

  // Form states
  const [subjectName, setSubjectName] = useState(subjects[0]?.name || '')
  const [examDate, setExamDate] = useState('')
  const [examTime, setExamTime] = useState('09:30 AM')
  const [targetScore, setTargetScore] = useState('Grade A+ (95%)')
  const [syllabusCompletion, setSyllabusCompletion] = useState<number>(60)
  const [importantTopicsStr, setImportantTopicsStr] = useState('')
  const [checklists, setChecklists] = useState<string>('Revise lecture slides\nSolve previous year question paper\nReview formula sheet')

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subjectName || !examDate) return

    const importantTopics = importantTopicsStr.split(',').map(s => s.trim()).filter(Boolean)
    const revisionChecklist = checklists.split('\n').filter(s => s.trim()).map((text, i) => ({
      id: `chk-${Date.now()}-${i}`,
      text: text.trim(),
      done: false
    }))

    const matchedSubject = subjects.find(s => s.name.toLowerCase() === subjectName.toLowerCase())

    addExam({
      subjectId: matchedSubject?.id,
      subjectName,
      examDate,
      examTime,
      targetScore,
      syllabusCompletion,
      preparationStatus: syllabusCompletion >= 80 ? 'ready' : 'in_progress',
      importantTopics,
      revisionChecklist,
    })

    setShowModal(false)
  }

  const toggleChecklistItem = (examId: string, checkId: string) => {
    const exam = exams.find(e => e.id === examId)
    if (!exam) return

    const updatedChecklist = (exam.revisionChecklist || []).map(item =>
      item.id === checkId ? { ...item, done: !item.done } : item
    )

    updateExam(examId, { revisionChecklist: updatedChecklist })
  }

  // Sorted by approaching days
  const examsWithDays = exams.map(e => {
    const daysLeft = differenceInDays(parseISO(e.examDate), new Date())
    return { ...e, daysLeft }
  }).sort((a, b) => a.daysLeft - b.daysLeft)

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Examination Countdown & Readiness
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track days remaining, revision checklists, and preparedness metrics for all upcoming exams.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Examination</span>
        </button>
      </div>

      {/* Prominent Countdown Banner for the Closest Exam */}
      {examsWithDays.length > 0 && examsWithDays[0].daysLeft >= 0 && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-rose-500/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Next Upcoming Examination</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {examsWithDays[0].subjectName}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Scheduled for {format(parseISO(examsWithDays[0].examDate), 'EEEE, MMMM d, yyyy')} at {examsWithDays[0].examTime}
              </p>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-4xl sm:text-5xl font-black text-rose-400 tracking-tight">
                {examsWithDays[0].daysLeft}
              </span>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Days Remaining
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examsWithDays.map(exam => {
          const isUrgent = exam.daysLeft <= 14 && exam.daysLeft >= 0
          const isPassed = exam.daysLeft < 0

          return (
            <div
              key={exam.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border shadow-soft flex flex-col justify-between transition-all ${
                isUrgent
                  ? 'border-rose-300 dark:border-rose-900/60 shadow-rose-500/5'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Target: {exam.targetScore}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {exam.subjectName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{format(parseISO(exam.examDate), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{exam.examTime}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-2xl text-xs font-black shadow-sm ${
                        isPassed
                          ? 'bg-slate-100 text-slate-500'
                          : isUrgent
                          ? 'bg-rose-500 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {isPassed ? 'Completed' : `${exam.daysLeft} Days Left`}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Remove exam for ${exam.subjectName}?`)) deleteExam(exam.id)
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Important topics tags */}
                {exam.importantTopics && exam.importantTopics.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      High-Yield Topics
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {exam.importantTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Revision Checklist */}
                {exam.revisionChecklist && exam.revisionChecklist.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Exam Prep Checklist
                    </span>
                    <div className="space-y-1.5">
                      {exam.revisionChecklist.map(item => (
                        <div
                          key={item.id}
                          onClick={() => toggleChecklistItem(exam.id, item.id)}
                          className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              item.done
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {item.done && <CheckSquare className="w-3 h-3" />}
                          </div>
                          <span className={item.done ? 'line-through opacity-60' : ''}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Syllabus completion slider */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Syllabus Readiness
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {exam.syllabusCompletion}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${exam.syllabusCompletion}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
              Add Upcoming Examination
            </h3>

            <form onSubmit={handleSaveExam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={subjectName}
                  onChange={e => setSubjectName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Time
                  </label>
                  <input
                    type="text"
                    value={examTime}
                    onChange={e => setExamTime(e.target.value)}
                    placeholder="e.g. 09:30 AM"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Score / Grade
                  </label>
                  <input
                    type="text"
                    value={targetScore}
                    onChange={e => setTargetScore(e.target.value)}
                    placeholder="e.g. Grade A+"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Syllabus Completed (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={syllabusCompletion}
                    onChange={e => setSyllabusCompletion(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Important Topics (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Graph Theory, Dynamic Programming"
                  value={importantTopicsStr}
                  onChange={e => setImportantTopicsStr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Revision Checklist (One per line)
                </label>
                <textarea
                  rows={3}
                  value={checklists}
                  onChange={e => setChecklists(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all mt-4"
              >
                Schedule Examination
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
