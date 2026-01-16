import axios from "axios"
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import ScoreCircle from "./ui/scoreCircle"
import { Button } from "./ui/button"
import { Spinner } from "./ui/spinner"

const API = import.meta.env.VITE_API_BASE_URL


const PostInterview = () => {
    const { state } = useLocation()
    const interviewId = state?.interviewId

    const [error, setError] = useState(null)
    const [result, setResult] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const resp = await axios.get(
                    `${API}/results/getByInterviewId/${interviewId}`
                ).then(res => setResult(res.data.data))
                    .catch(async (e) => {
                        console.log(e);
                        //call generate result
                        const again = await axios.get(`${API}/results/generateAfterFailure/${interviewId}`)
                            .then(res => {
                                console.log(res.data);
                                setResult(res.data.data)
                            })
                            .catch(e => setError(e.data.message))
                        //set messages like" results not found" generating again...

                    })
            } catch (e) {
                console.error(e)
            }
        }

        if (interviewId) fetchResult()
    }, [interviewId])

    if (!result) {
        return (
            <div className="h-screen flex items-center justify-center text-red-500">
                <Spinner className={'size-12'}/>
            </div>
        )
    }
    if(error != null){
        return (
            <div className="h-screen flex items-center justify-center">
                we are not able to process your request at this moment...to force generate results, you can tap on lastmost completed interview visible on dashboard
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-zinc-100 p-10">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 space-y-6">

                <div className="flex justify-center mb-6">
                    <ScoreCircle score={result.score} size={160} />
                </div>


                <div className="flex flex-col gap-8">

                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-zinc-800 mb-2">Overall Assessment</h3>
                        <p className="text-zinc-600 leading-relaxed">
                            {result.overallAssessment}
                        </p>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-zinc-800 mb-2">Improvements</h3>
                        <ul className="list-disc pl-5 text-zinc-600 space-y-1">
                            {result.improvements?.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div>
                    <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
                </div>
            </div>
        </div>
    )
}

export default PostInterview
