import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScoreCircle from './ui/scoreCircle'
import { Spinner } from './ui/spinner'

const API = import.meta.env.VITE_API_BASE_URL

const OverviewDashboard = () => {
    const [data, setData] = useState([])
    const [quiz, setQuiz] = useState([])
    const [score, setScore] = useState(0)
    const [loading, setIsLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        const func = async () => {
            const resp = await axios.get(`${API}/interview/getInterviewsForDashboard/${localStorage.getItem("userUid")}`)
                .then(res => {
                    setIsLoading(false);
                    // console.log(res)
                    const result = Array.isArray(res.data.data) ? res.data.data : Object.values(res.data.data)
                    setData(result)
                    setScore(Math.round(res.data.avgScore))
                    setQuiz(res.data.quizResp)
                })
        }
        func()
    }, [])


    const getQuizResult = async (quizId, noOfQuestions) => {
        try {
            // console.log(quizId)
            const resp = await axios.get(`${API}/quiz/results/${quizId}`)
            navigate('/quizResult', { state: { score: resp.data.score, noOfQuestions: noOfQuestions } })
        } catch (e) {
            console.log(e.message);
        }
    }


    if (loading) {
        return (
            <div className='flex justify-center items-center text-red-500 h-screen'>
                <Spinner className={'h-10 w-10'} />
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 p-2 sm:p-4 h-full">

            <div className="flex flex-col gap-4 sm:gap-6 h-full">

                <div className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-3 items-center justify-between min-h-[260px]">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Interview Readiness Score</h3>
                        <p className="text-sm text-muted-foreground">
                            Overall performance evaluation
                        </p>
                    </div>

                    {data.length === 0 && (
                        <div className="font-bold text-sm text-center">
                            Attempt at least one interview for this.
                        </div>
                    )}

                    <ScoreCircle score={score} />
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
                    <div>
                        <h3 className="text-lg font-semibold">Analyse Your Resume</h3>
                        <p className="text-sm opacity-90 mt-1">
                            Get AI-powered feedback to improve your chances of getting hired
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard', { state: { tab: "Analyse Resume" } })}
                        className="mt-4 bg-white text-red-600 font-medium py-2 rounded-xl hover:bg-zinc-100 transition"
                    >
                        Start Resume Analysis
                    </button>
                </div>

            </div>

            <div className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col
      min-h-[420px] sm:min-h-[520px] lg:min-h-0 overflow-hidden">
                <h3 className="text-xl font-semibold text-red-500">
                    Completed Interviews
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Your finished interviews
                </p>

                <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                    {data.filter(d => d.isCompleted).map(item => (
                        <div
                            key={item._id}
                            className="flex items-start gap-4 border rounded-xl p-4 hover:shadow transition cursor-pointer"
                            onClick={() =>
                                navigate('/postInterview', { state: { interviewId: item._id } })
                            }
                        >
                            <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-red-50 text-red-500 font-semibold text-lg">
                                {item.topic?.[0]?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium capitalize truncate">
                                    {item.topic}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Experience: {item.experience} year{item.experience > 1 ? "s" : ""}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    Skills: {item.skills.join(", ")}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col
      min-h-[420px] sm:min-h-[520px] lg:min-h-0 overflow-hidden">
                <h3 className="text-xl font-semibold text-red-500">
                    Completed Quizzes
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Your finished quizzes
                </p>

                <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                    {quiz.filter(q => q.isCompleted).map(item => (
                        <div
                            key={item._id}
                            className="flex items-center gap-4 border rounded-xl p-4 hover:shadow transition cursor-pointer"
                            onClick={() => getQuizResult(item._id, item.noOfQuestions)}
                        >
                            <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-red-50 text-red-500 font-semibold text-lg">
                                {item.topic?.[0]?.toUpperCase() || "Q"}
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium capitalize truncate">
                                    {item.topic}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    No of Questions: {item.noOfQuestions}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )

}

export default OverviewDashboard
