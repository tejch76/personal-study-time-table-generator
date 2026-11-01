import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Subject, Difficulty, Priority } from '../../types'
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  Tag,
  Check,
  X
} from 'lucide-react'
import { format } from 'date-fns'

const COLOR_PALETTE = [
  '#6366f1', // Indigo
  '#0ea5e9', // Sky Blue
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#f43f5e', // Rose
  '#06b6d4', // Cyan
  '#ec4899', // Pink
]

export const SubjectManagement: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject, generateTimetable } = useApp()

  const [showModal, setShowModal] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [color, setColor] = useState(COLOR_PALETTE[0])
  const [difficulty, setDifficulty] = useState<Difficulty>(2)
  const [priority, setPriority] = useState<Priority>(2)
  const [totalChapters, setTotalChapters] = useState<number>(10)
  const [completedChapters, setCompletedChapters] = useState<number>(3)
  const [weakTopicsStr, setWeakTopicsStr] = useState('')
  const [importantTopicsStr, setImportantTopicsStr] = useState('')
  const [examDate, setExamDate] = useState('')

  const openAddModal = () => {
    setEditingId(null)
    setName('')
    setCode('')
    setColor(COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)])
    setDifficulty(2)
    setPriority(2)
    setTotalChapters(10)
    setCompletedChapters(0)
    setWeakTopicsStr('')
    setImportantTopicsStr('')
    setExamDate('')
    setShowModal(true)
  }

  const openEditModal = (sub: Subject) => {
    setEditingId(sub.id)
    setName(sub.name)
    setCode(sub.code || '')
    setColor(sub.color || COLOR_PALETTE[0])
    setDifficulty(sub.difficulty)
    setPriority(sub.priority)
    setTotalChapters(sub.totalChapters || 10)
    setCompletedChapters(sub.completedChapters || 0)
    setWeakTopicsStr((sub.weakTopics || []).join(', '))
    setImportantTopicsStr((sub.importantTopics || []).join(', '))
    setExamDate(sub.examDate || '')
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const weakTopics = weakTopicsStr.split(',').map(s => s.trim()).filter(Boolean)
    const importantTopics = importantTopicsStr.split(',').map(s => s.trim()).filter(Boolean)

    if (editingId) {
      updateSubject(editingId, {
        name,
        code,
        color,
        difficulty,
        priority,
        totalChapters,
        completedChapters,
        weakTopics,
        importantTopics,
        examDate: examDate || undefined,
      })
    } else {
      addSubject({
        name,
        code,
        color,
        difficulty,
        priority,
        totalChapters,
        completedChapters,
        weakTopics,
        importantTopics,
        examDate: examDate || undefined,
      })
    }

    setShowModal(false)
  }

  const handleIncrementChapter = (sub: Subject) => {
    if (sub.completedChapters < sub.totalChapters) {
      updateSubject(sub.id, { completedChapters: sub.completedChapters + 1 })
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Subject & Syllabus Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure difficulty, priority, weak areas, and syllabus completion for precision AI scheduling.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub) => {
          const progressPercent = Math.min(100, Math.round(((sub.completedChapters || 0) / (sub.totalChapters || 1)) * 100))

          return (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top badge row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                      style={{ backgroundColor: sub.color }}
                    >
                      {sub.code ? sub.code.substring(0, 3) : sub.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {sub.name}
                      </h3>
                      {sub.code && (
                        <span className="text-[11px] font-semibold text-slate-400">
                          Code: {sub.code}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(sub)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Subject"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${sub.name}?`)) deleteSubject(sub.id)
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tags & Levels */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Difficulty: {sub.difficulty === 3 ? '🔥 High' : sub.difficulty === 2 ? '⚡ Medium' : '🌱 Easy'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    Priority: {sub.priority === 3 ? '🔴 Top Priority' : sub.priority === 2 ? '🟡 Normal' : '🟢 Low'}
                  </span>
                  {sub.examDate && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Exam: {sub.examDate}</span>
                    </span>
                  )}
                </div>

                {/* Weak Topics */}
                {sub.weakTopics && sub.weakTopics.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Target Weak Topics
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sub.weakTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress & Chapter Counter */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Syllabus Completed
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {sub.completedChapters} / {sub.totalChapters} Chapters ({progressPercent}%)
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%`, backgroundColor: sub.color }}
                  />
                </div>

                <button
                  onClick={() => handleIncrementChapter(sub)}
                  disabled={sub.completedChapters >= sub.totalChapters}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Mark +1 Chapter Completed</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add / Edit Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
              {editingId ? 'Edit Subject' : 'Add New Subject'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS401"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Subject Theme Color
                </label>
                <div className="flex gap-2.5">
                  {COLOR_PALETTE.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        color === c ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Difficulty & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(Number(e.target.value) as Difficulty)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  >
                    <option value={1}>1 - Easy / Familiar</option>
                    <option value={2}>2 - Moderate</option>
                    <option value={3}>3 - Hard / High Effort</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Priority
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(Number(e.target.value) as Priority)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  >
                    <option value={1}>1 - Low Priority</option>
                    <option value={2}>2 - Standard Priority</option>
                    <option value={3}>3 - High Priority</option>
                  </select>
                </div>
              </div>

              {/* Chapters count */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Chapters
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={totalChapters}
                    onChange={e => setTotalChapters(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Completed Chapters
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={totalChapters}
                    value={completedChapters}
                    onChange={e => setCompletedChapters(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              {/* Weak topics */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Weak Topics (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dynamic Programming, Graph Shortest Paths"
                  value={weakTopicsStr}
                  onChange={e => setWeakTopicsStr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Important Topics for Exam
                </label>
                <input
                  type="text"
                  placeholder="e.g. B-Trees, Normalization"
                  value={importantTopicsStr}
                  onChange={e => setImportantTopicsStr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all mt-4"
              >
                {editingId ? 'Save Changes' : 'Create Subject'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
