// import classNames from 'classnames'
import React, { useState } from 'react'

// import { ToggleButton } from '../../..'
// import AccessRights from '../AccessRights'

// import s from './AccessRightsListItem.module.scss'

export default function AccessRightsListItem({ item }) {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(!setOpen)
  }

  if (item.children) {
    return (
      <div className={open ? 'sidebar-item open' : 'sidebar-item'}>
        <div className="sidebar-title">
          <span>
            {/* {item.icon && <i className={item.icon}></i>} */}
            {item.title}
          </span>
          <button className="bi-chevron-down toggle-btn" onClick={handleClick}></button>
        </div>
        <div className="sidebar-content">
          {item.childrens.map((child, index) => (
            <AccessRightsListItem key={index} item={child} />
          ))}
        </div>
      </div>
    )
  } else {
    return (
      <li className="sidebar-item plain">
        {/* {item.icon && <i className={item.icon}></i>} */}
        {item.title}
      </li>
    )
  }

  // return itemTitle ? (
  //   <div>
  //     <button
  //       className={classNames({
  //         [s.title_inside_wrapper]: true,
  //         [s.opened]: open,
  //       })}
  //       onClick={handleClick}
  //     >
  //       <h5>{itemTitle}</h5>
  //       <span className={s.arrow_show_more}>&lt;</span>
  //     </button>
  //     <ul
  //       className={classNames({
  //         [s.sub_list]: true,
  //         [s.opened]: open,
  //       })}
  //     >
  //       {itemChildren && <AccessRights items={itemChildren} />}
  //     </ul>
  //   </div>
  // ) : (
  //   <>
  //     <div className={s.list_item_wrapper}>
  //       <p>{itemText}</p>
  //       <ToggleButton />
  //     </div>
  //     {/* <ul className={s.sub_list}>
  //                   <li> {item.children && <AccessRights items={item.children} />}</li>
  //                 </ul> */}
  //   </>
  // )
}
