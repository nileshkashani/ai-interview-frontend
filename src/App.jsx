
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Starter from './components/starter'
import Login from './components/login'
import Signup from './components/signup'
import AiInterview from './components/aiInterview'
import AfterLoginLayout from './components/afterLoginLayout'
import ProtectedRoute from './components/ProjectedRoute'
import PostInterview from './components/postInterview'
import Quiz from './components/quiz'
import AnalyseResume from './components/analyseResume'
import QuizResult from './components/quizResult'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Starter />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AfterLoginLayout />
              </ProtectedRoute>
            }
          />
          <Route path="/ai-interview" element={<AiInterview />} />
          <Route path="/postinterview" element={<PostInterview />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/analyseResume" element={<AnalyseResume />} />
          <Route path="/quizResult" element={<QuizResult />} />
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
