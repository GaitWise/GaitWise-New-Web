'use client'
import { CalendarTodayIcon, GenderMark, InsuranceIcon } from 'icons'
import { IdCard, PencilIcon, PhoneIcon } from 'lucide-react'
import { useState } from 'react'
import { User } from 'types'

const Profile = ({ participant }: { participant: User }) => {
  // 状態で入力フィールドを管理
  const [participantData, setParticipantData] = useState({
    firstName: participant.firstName,
    lastName: participant.lastName,
    gender: participant.gender,
    age: participant.age,
    email: participant.email,
    height: participant.height,
    weight: `${participant.weight.value} ${participant.weight.type}`,
    job: participant.job,
    status: participant.status,
  })

  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    gender: false,
    age: false,
    email: false,
    height: false,
    weight: false,
    job: false,
    status: false,
  })

  // 入力値変更ハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setParticipantData({
      ...participantData,
      [name]: value,
    })
  }

  // 編集モードの切り替え
  const toggleEditMode = (field: keyof typeof isEditing) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <section role="list" className="divide-y divide-gray-100 rounded-3xl bg-white p-5">
      <div className="grid grid-cols-1 justify-items-center gap-6 pb-4">
        <div className="grid w-full grid-cols-6 grid-rows-1 gap-8">
          {/* 名前 (First Name) */}
          <div className="col-span-1 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <IdCard />
          </div>
          <div className="col-span-4">
            <h3 className="font-light">First Name</h3>
            {isEditing.firstName ? (
              <input
                type="text"
                name="firstName"
                value={participantData.firstName}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            ) : (
              <p className="font-semibold">{participantData.firstName}</p>
            )}
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <button onClick={() => toggleEditMode('firstName')}>
              <PencilIcon />
            </button>
          </div>

          {/* 性別 (Gender) */}
          <div className="col-span-1 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <GenderMark />
          </div>
          <div className="col-span-4">
            <h3 className="font-light">Gender</h3>
            {isEditing.gender ? (
              <select
                name="gender"
                value={participantData.gender}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="font-semibold">{participantData.gender}</p>
            )}
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <button onClick={() => toggleEditMode('gender')}>
              <PencilIcon />
            </button>
          </div>

          {/* 年齢 (Age) */}
          <div className="col-span-1 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <CalendarTodayIcon />
          </div>
          <div className="col-span-4">
            <h3 className="font-light">Age</h3>
            {isEditing.age ? (
              <input
                type="number"
                name="age"
                value={participantData.age}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            ) : (
              <p className="font-semibold">{participantData.age}</p>
            )}
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <button onClick={() => toggleEditMode('age')}>
              <PencilIcon />
            </button>
          </div>

          {/* メールアドレス (Email) */}
          <div className="col-span-1 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <PhoneIcon />
          </div>
          <div className="col-span-4">
            <h3 className="font-light">Email</h3>
            {isEditing.email ? (
              <input
                type="email"
                name="email"
                value={participantData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            ) : (
              <p className="font-semibold">{participantData.email}</p>
            )}
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <button onClick={() => toggleEditMode('email')}>
              <PencilIcon />
            </button>
          </div>

          {/* 身長 (Height) */}
          <div className="col-span-1 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <InsuranceIcon />
          </div>
          <div className="col-span-4">
            <h3 className="font-light">Height</h3>
            {isEditing.height ? (
              <input
                type="number"
                name="height"
                value={participantData.height}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            ) : (
              <p className="font-semibold">{participantData.height} cm</p>
            )}
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <button onClick={() => toggleEditMode('height')}>
              <PencilIcon />
            </button>
          </div>

          {/* 職業 (Job) */}
          <div className="col-span-1 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <IdCard />
          </div>
          <div className="col-span-4">
            <h3 className="font-light">Job</h3>
            {isEditing.job ? (
              <input
                type="text"
                name="job"
                value={participantData.job}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            ) : (
              <p className="font-semibold">{participantData.job}</p>
            )}
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <button onClick={() => toggleEditMode('job')}>
              <PencilIcon />
            </button>
          </div>
        </div>
        <button className="mt-8 justify-self-center rounded-full bg-teal-300 px-12 py-4 font-semibold text-black hover:bg-teal-500">
          Save Changes
        </button>
      </div>
    </section>
  )
}

export default Profile
