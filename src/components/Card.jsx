import React from 'react'

export const Card = ({ title, items, actions }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-lg relative mb-3 hover:shadow-2xl">
      <h2 className="text-1xl font-bold mb-2 mt-5">{title}</h2>
      <div className="mb-4">
        {items.map((item, index) => (
          <InfoItem key={index} {...item} />
        ))}
      </div>
      
      {actions && (
        <div className="absolute top-2 right-2 flex space-x-2">
          {actions.map((action, index) => (
            <ActionButton key={index} {...action} />
          ))}
        </div>
      )}
    </div>
  )
}

const InfoItem = ({ icon: Icon, text, color }) => (
  <div className="flex items-center mb-3">
    <Icon className={`mr-3 text-${color}-500`} />
    <span className="text-gray-700">{text}</span>
  </div>
)

const ActionButton = ({ icon: Icon, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`p-2 bg-${color}-500 text-white rounded-full shadow-md hover:bg-${color}-600 transition duration-300`}
  >
    <Icon />
  </button>
)
