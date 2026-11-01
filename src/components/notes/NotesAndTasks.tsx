import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Note, StudyTask, TaskPriority, TaskType } from '../../types'
import {
  FileText,
  CheckSquare,
  Plus,
  Trash2,
  Edit2,
  Search,
  Pin,
  Calendar,
  AlertCircle,
  Tag,
  Check,
  X
} from 'lucide-react'
import { format, isPast, parseISO } from 'date-fns'

export const NotesAndTasks: React.FC = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    subjects,
  } = useApp()

  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'notes'>('tasks')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all')

  // Task Modal state
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskType, setTaskType] = useState<TaskType>('assignment')
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [taskSubjectId, setTaskSubjectId] = useState(subjects[0]?.id || '')

  // Note Modal state
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [noteSubjectId, setNoteSubjectId] = useState(subjects[0]?.id || '')
  const [noteTagsStr, setNoteTagsStr] = useState('')

  // Task creation handler
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle.trim()) return

    const sub = subjects.find(s => s.id === taskSubjectId)

    addTask({
      subjectId: sub?.id,
      subjectName: sub?.name,
      title: taskTitle,
      description: taskDesc,
      taskType,
      priority: taskPriority,
      dueDate: taskDueDate || format(new Date(), 'yyyy-MM-dd'),
      isCompleted: false,
    })

    setShowTaskModal(false)
    setTaskTitle('')
    setTaskDesc('')
  }

  // Note creation handler
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteTitle.trim()) return

    const sub = subjects.find(s => s.id === noteSubjectId)
    const tags = noteTagsStr.split(',').map(s => s.trim()).filter(Boolean)

    addNote({
      subjectId: sub?.id,
      subjectName: sub?.name,
      title: noteTitle,
      content: noteContent,
      tags,
      isPinned: false,
    })

    setShowNoteModal(false)
    setNoteTitle('')
    setNoteContent('')
    setNoteTagsStr('')
  }

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSub = selectedSubjectFilter === 'all' || n.subjectId === selectedSubjectFilter
    return matchesSearch && matchesSub
  })

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSub = selectedSubjectFilter === 'all' || t.subjectId === selectedSubjectFilter
    return matchesSearch && matchesSub
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Notes & Task Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Capture academic summaries and organize project assignments and problem sets.
          </p>
        </div>

        {/* Tab switch & Add buttons */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveSubTab('tasks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'tasks'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveSubTab('notes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'notes'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Notes ({notes.length})
            </button>
          </div>

          {activeSubTab === 'tasks' ? (
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          ) : (
            <button
              onClick={() => setShowNoteModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Note</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={activeSubTab === 'tasks' ? 'Search tasks by keyword...' : 'Search notes by keyword or tag...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 shadow-soft outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedSubjectFilter}
          onChange={e => setSelectedSubjectFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-soft"
        >
          <option value="all">All Subjects</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* 1. TASKS TAB */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              No tasks found. Create a new assignment or study task above!
            </div>
          ) : (
            filteredTasks.map(task => {
              const isOverdue = task.dueDate && !task.isCompleted && isPast(parseISO(task.dueDate))

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    task.isCompleted
                      ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-60'
                      : isOverdue
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/50'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-soft hover:shadow'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        task.isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                      }`}
                    >
                      {task.isCompleted && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs font-bold text-slate-900 dark:text-white ${task.isCompleted ? 'line-through' : ''}`}>
                          {task.title}
                        </h4>
                        {task.subjectName && (
                          <span className="text-[10px] font-semibold text-slate-400">
                            • {task.subjectName}
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            task.priority === 'high'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                              : task.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Due: {task.dueDate}</span>
                        </span>
                        {isOverdue && (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Overdue</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* 2. NOTES TAB */}
      {activeSubTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full p-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              No notes found. Create your first subject summary note!
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {note.subjectName || 'General Notes'}
                    </span>
                    <button
                      onClick={() => updateNote(note.id, { isPinned: !note.isPinned })}
                      className={`p-1 rounded-lg ${note.isPinned ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'}`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {note.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed line-clamp-6">
                    {note.content}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((t, idx) => (
                      <span key={idx} className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button onClick={() => setShowTaskModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Academic Task</h3>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={taskSubjectId}
                  onChange={e => setTaskSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Exercise 3: Binary Heaps"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Additional assignment details or requirements..."
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md">
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button onClick={() => setShowNoteModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create Study Note</h3>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={noteSubjectId}
                  onChange={e => setNoteSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Theorem Complexity Breakdown"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Content</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Key theorems, bullet points, formula proofs..."
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Algorithms, Proofs, Exam1"
                  value={noteTagsStr}
                  onChange={e => setNoteTagsStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md">
                Save Note
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
