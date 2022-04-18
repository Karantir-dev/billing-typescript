// import classNames from 'classnames'
import React from 'react'
// import ToggleButton from '../../ui/ToggleButton/ToggleButton'
// import ControlBtn from '../ControlBtn/ControlBtn'

import s from './AccessRights.module.scss'
import AccessRightsListItem from './AccessRightsListItem/AccessRightsListItem'

export default function AccessRights({ items }) {
  // const [isMenuOpened, setIsMenuOpened] = useState(false)

  // const handleClick = () => {
  //   setIsMenuOpened(!isMenuOpened)
  // }

  return (
    <ul className={s.list}>
      {items.map(item => {
        return (
          <AccessRightsListItem
            key={Math.random()}
            itemChildren={item.children}
            itemTitle={item.title}
            itemText={item.element.text}
          />
          // <>
          //   <li key={Math.random()}>
          //     {item.title ? (
          //       <div>
          //         <button
          //           className={classNames({
          //             [s.title_inside_wrapper]: true,
          //             [s.opened]: isMenuOpened,
          //           })}
          //           onClick={handleClick}
          //         >
          //           <h5>{item.title}</h5>
          //           <span className={s.arrow_show_more}>&lt;</span>
          //         </button>
          //         <ul
          //           className={classNames({
          //             [s.sub_list]: true,
          //             [s.opened]: isMenuOpened,
          //           })}
          //         >
          //           {item.children && <AccessRights items={item.children} />}
          //         </ul>
          //       </div>
          //     ) : (
          //       <>
          //         <div className={s.list_item_wrapper}>
          //           <p>{item.element.text}</p>
          //           <ToggleButton />
          //         </div>
          //         {/* <ul className={s.sub_list}>
          //           <li> {item.children && <AccessRights items={item.children} />}</li>
          //         </ul> */}
          //       </>
          //     )}
          //   </li>
          // </>
        )
      })}
    </ul>
  )
}
