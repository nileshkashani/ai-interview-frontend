import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaPencilAlt } from 'react-icons/fa'

const API = import.meta.env.VITE_API_BASE_URL

const Profile = () => {
    const [user, setUser] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [form, setForm] = useState({ name: '', email: '' })

    useEffect(() => {
        const func = async () => {
            await axios.get(`${API}/user/get/${localStorage.getItem("userUid")}`)
                .then((res) => {
                    setUser(res.data.data)
                    setForm({ name: res.data.data.name, email: res.data.data.email })
                })
                .catch(e => console.log(e))
        }
        func()
    }, [])

    const handleSave = async () => {
        await axios.put(`${API}/user/update`, {
            userId: localStorage.getItem("userUid"),
            name: form.name
        })
        setUser({ ...user, ...form })
        setEditMode(false)
    }

    return (
        <div className="max-w-md p-6 border rounded-xl shadow-sm space-y-4">
            {user && (
                <>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Profile</h2>
                        <button onClick={() => setEditMode(!editMode)} className="p-2 rounded hover:bg-zinc-100">
                            <FaPencilAlt />
                        </button>
                    </div>

                    {!editMode ? (
                        <div className="space-y-2">
                            <div>Name: {user.name}</div>
                            <div>Email: {user.email}</div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <input
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                            <button
                                onClick={handleSave}
                                className="w-full bg-black text-white p-2 rounded"
                            >
                                Save
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Profile
