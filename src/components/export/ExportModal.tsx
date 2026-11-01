import React, { useState } from 'react'
import { StudySession, StudentProfile } from '../../types'
import { jsPDF } from 'jspdf'
import {
  Download,
  FileSpreadsheet,
  Printer,
  FileText,
  X,
  CheckCircle2
} from 'lucide-react'
import { format } from 'date-fns'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  sessions: StudySession[]
  profile: StudentProfile
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  sessions,
  profile
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)

  if (!isOpen) return null

  // 1. Export as CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Start Time', 'End Time', 'Duration (mins)', 'Subject', 'Topic', 'Session Type', 'Status']
    const rows = sessions.map(s => [
      `"${s.sessionDate}"`,
      `"${s.startTime}"`,
      `"${s.endTime}"`,
      s.durationMinutes,
      `"${s.subjectName.replace(/"/g, '""')}"`,
      `"${s.topic.replace(/"/g, '""')}"`,
      `"${s.sessionType}"`,
      `"${s.status}"`
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `smartstudy_timetable_${format(new Date(), 'yyyy-MM-dd')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setDownloadSuccess('CSV Timetable exported successfully!')
    setTimeout(() => setDownloadSuccess(null), 3000)
  }

  // 2. Export as PDF
  const handleExportPDF = (type: 'weekly' | 'daily') => {
    const doc = new jsPDF()

    // Title banner
    doc.setFillColor(79, 70, 229) // Indigo
    doc.rect(0, 0, 210, 30, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(255, 255, 255)
    doc.text('SmartStudy AI – Personal Study Timetable', 14, 18)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Student: ${profile.fullName} | Degree: ${profile.degree || 'Engineering'} | Date: ${format(new Date(), 'MMM d, yyyy')}`, 14, 25)

    // Table Content
    let y = 42
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(type === 'weekly' ? '7-Day Comprehensive Study Schedule' : "Today's Study Plan", 14, y)
    y += 8

    // Headers
    doc.setFillColor(241, 245, 249)
    doc.rect(14, y, 182, 8, 'F')
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(71, 85, 105)
    doc.text('Date', 16, y + 5.5)
    doc.text('Time', 42, y + 5.5)
    doc.text('Subject', 75, y + 5.5)
    doc.text('Topic', 125, y + 5.5)
    doc.text('Type', 175, y + 5.5)
    y += 10

    const todayStr = format(new Date(), 'yyyy-MM-dd')
    const filtered = type === 'daily'
      ? sessions.filter(s => s.sessionDate === todayStr)
      : sessions.slice(0, 25) // Page limit for clean layout

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)

    filtered.forEach((sess, idx) => {
      if (y > 275) {
        doc.addPage()
        y = 20
      }

      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 252)
        doc.rect(14, y - 4, 182, 7, 'F')
      }

      doc.setTextColor(30, 41, 59)
      doc.text(sess.sessionDate, 16, y + 1)
      doc.text(`${sess.startTime}-${sess.endTime}`, 42, y + 1)
      doc.text(sess.subjectName.substring(0, 22), 75, y + 1)
      doc.text(sess.topic.substring(0, 26), 125, y + 1)
      doc.text(sess.sessionType, 175, y + 1)

      y += 7.5
    })

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text('Generated with SmartStudy AI • Built for academic excellence', 14, 288)

    doc.save(`smartstudy_${type}_timetable_${format(new Date(), 'yyyyMMdd')}.pdf`)

    setDownloadSuccess(`${type === 'weekly' ? 'Weekly' : 'Daily'} PDF generated successfully!`)
    setTimeout(() => setDownloadSuccess(null), 3000)
  }

  // 3. Print
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3">
            <Download className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Export Your Study Timetable
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Choose your preferred format for offline study or calendar syncing.
          </p>
        </div>

        {downloadSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => handleExportPDF('weekly')}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-left transition-all group"
          >
            <FileText className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Weekly PDF
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Clean, printer-friendly 7-day schedule
            </p>
          </button>

          <button
            onClick={() => handleExportPDF('daily')}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-left transition-all group"
          >
            <FileText className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Today's Daily PDF
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Focused agenda for today
            </p>
          </button>

          <button
            onClick={handleExportCSV}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 text-left transition-all group"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              CSV Spreadsheet
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Excel / Google Sheets compatible
            </p>
          </button>

          <button
            onClick={handlePrint}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-500 hover:bg-sky-50/30 dark:hover:bg-sky-950/20 text-left transition-all group"
          >
            <Printer className="w-5 h-5 text-sky-600 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Print Timetable
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Direct physical print preview
            </p>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
