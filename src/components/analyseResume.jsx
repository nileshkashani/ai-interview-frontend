import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ScoreCircle from './ui/scoreCircle'
import { Spinner } from './ui/spinner'

const API = import.meta.env.VITE_API_BASE_URL

const messages = [
  "Getting ATS ready...",
  "Generating Response...",
  "Almost done..."
]

const AnalyseResume = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resume, setResume] = useState(null)
  const [msgIndex, setMsgIndex] = useState(0)

  const handleFileChange = e => {
    const selected = e.target.files[0]
    if (!selected) return
    setFile(selected)
  }

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('resume', file)
    formData.append('userId', localStorage.getItem('userUid'))

    try {
      setLoading(true)
      const res = await axios.post(`${API}/resume/upload`, formData)
        .then((resp) => setResume(resp.data.resume))
        .catch((e) => { return (<div>something went wrong please try again</div>) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) return
    if (msgIndex >= messages.length - 1) return

    const timer = setTimeout(() => {
      setMsgIndex(i => i + 1)
    }, 3000)

    return () => clearTimeout(timer)
  }, [loading, msgIndex])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center text-red-500 h-screen gap-4">
        <Spinner className="h-10 w-10" />
        <p className="text-lg font-medium animate-pulse">
          {messages[msgIndex]}
        </p>
      </div>
    )
  }
  return (
    <div className="h-full w-full p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">

        <div className="flex flex-col gap-6 min-h-0">

          <div className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">Upload Resume</h2>

            <div className="border-2 border-dashed rounded-xl p-6 text-center">
              <input
                type="file"
                accept=".jpg,.png,.pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resumeUpload"
              />
              <label
                htmlFor="resumeUpload"
                className="cursor-pointer text-sm text-zinc-600 break-all"
              >
                {file ? file.name : 'Click to upload resume'}
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`w-full bg-red-500 text-white py-2 rounded-xl transition disabled:opacity-50
              ${(file && !loading) ? 'hover:text-black' : 'hover:bg-zinc-800'}
            `}
            >
              {loading ? 'Analysing...' : 'Upload & Analyse'}
            </button>
          </div>

          {resume && (
            <div className="bg-white border rounded-2xl p-4 shadow-sm flex-1 min-h-[300px]">
              <h3 className="font-medium mb-3">Resume Preview</h3>

              <iframe
                src={resume.fileUrl}
                title="Resume Preview"
                className="w-full h-[300px] sm:h-full rounded-lg border"
              />
            </div>
          )}
        </div>

        {resume && (
          <div className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm overflow-y-auto max-h-[calc(100vh-6rem)]">
            <h2 className="text-lg font-semibold mb-2">AI Feedback</h2>

            <div className="flex justify-center mb-6">
              <ScoreCircle score={resume.score} size={140} />
            </div>

            <div className="prose max-w-none text-sm whitespace-pre-wrap mb-6">
              {resume.feedback}
            </div>

            <h3 className="font-medium mb-2">Key Improvements</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {resume.improvements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  )

}

export default AnalyseResume
