import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { RevisionRecord, RevisionInterval } from '../../types'
import {
  Repeat,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  Award,
  Star,
  Check,
  X
} from 'lucide-react'
import { format, addDays } from 'date-fns'

export const SyllabusTracker: React.FC = () => {
  const {
    subjects,
    revisionRecords,
    completeRevision,
    addRevisionRecord,
  } = useApp()

  const [showModal, setShowModal] = useState(false)
  const [selectedSubId, setSelectedSubId] = useState(subjects[0]?.id || '')
  const [topic, setTopic] = useState('')
  const [intervalDays, setIntervalDays] = useState<RevisionInterval>(3)

  const handleCreateRevision = (e: React.FormEvent) => {
    e.preventDefault()
    const sub = subjects.find(s => s.id === selectedSubId) || subjects[0]
    if (!sub || !topic.trim()) return

    const scheduledDate = format(addDays(new Date(), intervalDays), 'yyyy-MM-dd')

    addRevisionRecord({
      subjectId: sub.id,
      subjectName: sub.name,
      topic,
      intervalDays,
      scheduledDate,
      status: 'pending',
    })

    setShowModal(false)
    setTopic('')
  }

  const pendingRevisions = revisionRecords.filter(r => r.status === 'pending')
  const completedRevisions = revisionRecords.filter(r => r.status === 'completed')

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Spaced Revision Tracker (Ebbinghaus Forgetting Curve)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Systematic spaced intervals (1, 3, 7, 14, 30 days) scientifically convert short-term study into permanent recall.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Revision</span>
        </button>
      </div>

      {/* Spaced Intervals Concept Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { days: 1, label: 'Immediate Recall', desc: 'Prevents 80% initial memory decay' },
          { days: 3, label: 'Consolidation', desc: 'Strengthens neural synapse patterns' },
          { days: 7, label: 'Working Mastery', desc: 'Prepares for exam-level problem solving' },
          { days: 14, label: 'Long-Term Retention', desc: 'Locks core principles into permanent memory' },
        ].map(item => (
          <div
            key={item.days}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-extrabold text-xs flex items-center justify-center">
                {item.days}d
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {item.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Main Two Columns: Pending Revisions & Completed History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Revisions */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Repeat className="w-4 h-4 text-indigo-600" />
              <span>Pending Revision Sessions ({pendingRevisions.length})</span>
            </h3>
          </div>

          {pendingRevisions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">
              No pending revisions. Great job keeping your memory retention up to date!
            </p>
          ) : (
            <div className="space-y-3">
              {pendingRevisions.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                      {item.subjectName} • Interval: {item.intervalDays} Days
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                      {item.topic}
                    </h4>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>Due: {item.scheduledDate}</span>
                    </span>
                  </div>

                  {/* Rating / Mastery buttons on completion */}
                  <div className="flex items-center gap-1.5">
                    {[3, 4, 5].map(score => (
                      <button
                        key={score}
                        onClick={() => completeRevision(item.id, score)}
                        className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-bold transition-colors"
                        title={`Mark Done (Mastery: ${score}/5)`}
                      >
                        {score}★
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Revision History */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Consolidated & Mastered</span>
            </h3>
          </div>

          {completedRevisions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">
              Completed revisions with mastery scores will appear here.
            </p>
          ) : (
            <div className="space-y-3">
              {completedRevisions.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.topic}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {item.subjectName} • Completed on {item.completedDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{item.masteryScore}/5</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Revision Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Schedule Spaced Revision
            </h3>

            <form onSubmit={handleCreateRevision} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={selectedSubId}
                  onChange={e => setSelectedSubId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Concept
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dijkstra Shortest Path Proof"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Spaced Repetition Interval
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([1, 3, 7, 14] as RevisionInterval[]).map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setIntervalDays(days)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        intervalDays === days
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {days} Day{days > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all mt-4"
              >
                Schedule Spaced Session
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
