import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { Spinner } from './ui/spinner';


const API = import.meta.env.VITE_API_BASE_URL


const QuizCards = () => {
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState([])

  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const func = async () => {
      try {
        const resp = await axios.get(`${API}/quiz/findByIsCompleted/${localStorage.getItem("userUid")}`)
        .then((res) => {
        console.log(res)
        setQuiz(res.data)
        setIsLoading(false);
        })
      }
      catch (e) {
        console.error(e);
      }
    }
    func();
  }, [])
  if (loading) {
    return (
      <div className='flex justify-center items-center text-red-500 h-screen'>
        <Spinner className={'h-10 w-10'} />
      </div>
    )
  }
  return (
    <div className="bg-white max-h-screen px-6 py-10 pt-2 overflow-auto">

      <Card className="pt-2 h-full py-7">
        <CardHeader className="pb-4">
          <CardTitle className={'text-red-500 font-bold text-2xl'}>Incomplete Quizes</CardTitle>
          <CardDescription>
            Quizes you haven't completed yet
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 cursor-pointer" >
          {quiz
            .map(item => (
              <div
                key={item._id}
                onClick={() => navigate('/quiz', { state: { quizId: item._id } })}
                className="flex items-center justify-between border rounded-xl p-4 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-red-50 text-red-500 font-semibold text-lg">
                    {item.topic ? item.topic.charAt(0).toUpperCase() : "?"}
                  </div>

                  <div>
                    <p className="font-medium capitalize">{item.topic}</p>
                    <p className="text-sm text-muted-foreground">
                      No of Questions: {item.noOfQuestions}
                    </p>
                  </div>
                </div>
              </div>
            ))}

        </CardContent>
      </Card>
    </div>
  )
}

export default QuizCards