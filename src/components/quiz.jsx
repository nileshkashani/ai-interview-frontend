import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import ScoreCircle from './ui/scoreCircle'
import { Button } from './ui/button'

const API = import.meta.env.VITE_API_BASE_URL

const Quiz = () => {
    const { state } = useLocation()
    const quizId = state?.quizId
    const navigate = useNavigate()

    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [score, setScore] = useState(null)
    const [error, setIsError] = useState(false);

    useEffect(() => {
        if (!quizId) return

        const loadQuestions = async () => {
            const resp = await axios.get(`${API}/quiz/questions/getAll/${quizId}`)
            .then((res) => {
                setQuestions(res.data.data)
                console.log(res.data.data)
                if(res.data?.data?.length === 0){
                    setQuestions("Something went wrong from google gemini's side....please create quiz again"); 
                    setIsError(true)
                }
            })
        }

        loadQuestions()
    }, [quizId])

    const handleChange = (qIndex, option) => {
        setAnswers(prev => ({ ...prev, [qIndex]: option }))
    }

    if(error){
        return (
            <div className='flex h-screen flex-col justify-center items-center '>
                <div className=' rounded-md p-2'>{questions}</div>
                <Button onClick={() => navigate('/dashboard')} className={'bg-red-500 hover:bg-red-700'}>Dashboard</Button>
            </div>
        )
    }
    const handleSubmit = async () => {
        const payload = {
            answers: questions.map((q, index) => ({
                questionId: q._id,
                quizId,
                answer: answers[index] || ""
            }))
        }

        const res = await axios.post(`${API}/quiz/answers/add`, payload)
        console.log(res)
        setScore(res.data.score)
        setIsSubmitted(true)

        const resp = await axios.put(`${API}/quiz/update/${quizId}`)
        console.log(resp)

        navigate('/quizResult', { state: { score: res.data.score, noOfQuestions: questions.length } })
    }


    return (
        <div className="relative w-full h-screen bg-zinc-50">
            <div className="flex w-full h-full p-6 gap-6 pr-[380px]">


                <div className="flex-1 bg-white rounded-xl shadow-sm p-8 space-y-8 overflow-y-auto">
                    <h1 className="text-2xl font-bold text-red-500">AI Generated Quiz</h1>

                    {questions.map((q, qIndex) => (
                        <div key={q._id} className="border rounded-xl p-5 space-y-4">
                            <p className="font-medium text-zinc-800">
                                {qIndex + 1}. {q.text.replace("```c", "").replace("```", "")}
                            </p>

                            <div className="space-y-2">
                                {q.options.map((option, oIndex) => (
                                    <label
                                        key={oIndex}
                                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition
                  ${answers[qIndex] === option ? "border-red-500 bg-red-50" : "hover:bg-zinc-50"}`}
                                    >
                                        <input
                                            type="radio"
                                            name={`q-${qIndex}`}
                                            checked={answers[qIndex] === option}
                                            onChange={() => handleChange(qIndex, option)}
                                            className="accent-red-500"
                                        />
                                        <span className="text-sm text-zinc-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleSubmit}
                        className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                    >
                        Submit Quiz
                    </button>
                </div>
                <div className="hidden lg:block fixed top-6 right-6 w-[340px] bg-white rounded-xl shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold text-lg text-zinc-800">Progress</h2>
                    <p className="text-sm text-zinc-500">
                        Answered {Object.keys(answers).length} / {questions.length}
                    </p>

                    <div className="grid grid-cols-5 gap-2">
                        {questions.map((_, i) => (
                            <div
                                key={i}
                                className={`h-10 rounded-lg flex items-center justify-center text-sm font-semibold
              ${answers[i] ? "bg-red-500 text-white" : "bg-zinc-100 text-zinc-400"}`}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Quiz
