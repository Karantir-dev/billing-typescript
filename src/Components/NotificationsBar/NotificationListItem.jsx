import React from 'react'

export default function NotificationListItem({ arr, removeItem }) {
  //   const handleClick = () => {
  //     console.log('clicked')
  //     // removeItem(id)
  //   }
  console.log(arr)
  return (
    <>
      {Array.isArray(arr) ? (
        arr.map(notif => {
          return (
            <div key={notif.$id}>
              <p>{notif.msg.$}</p>
              <div>
                <button
                  onClick={() => {
                    removeItem(notif.$id)
                  }}
                >
                  X
                </button>
              </div>
            </div>
          )
        })
      ) : (
        <div key={arr.$id}>
          <p>{arr.msg.$}</p>
          <div>
            <button
              onClick={() => {
                removeItem(arr.$id)
              }}
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  )
}
