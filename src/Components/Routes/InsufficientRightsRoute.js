// import React from 'react'
// import { useSelector } from 'react-redux'
// import { Route } from 'react-router-dom'
// import checkIfComponentShouldRender from '../../checkIfComponentShouldRender'
// import { usersSelectors } from '../../Redux'
// import PrivateRoute from './PrivateRoute'
// import * as routes from '../../routes'

// /**
//  * - If the user has rights and the user is logged in, render the component
//  * - Otherwise render Redirect to /insufficient_rights
//  */
// export default function InsufficientRightsRoute({ children, children2 }) {
//   const currentSessionRights = useSelector(usersSelectors.getCurrentSessionRights)
//   const isComponentAllowedToRender = checkIfComponentShouldRender(
//     currentSessionRights,
//     'affiliate.client',
//   )

//   return (
//     <Route
//       path={
//         isComponentAllowedToRender ? routes.TRUSTED_USERS : routes.INSUFFICIENT_RIGHTS
//       }
//       element={
//         <PrivateRoute
//           children={isComponentAllowedToRender ? children : children2}
//           redirectTo={
//             isComponentAllowedToRender ? routes.LOGIN : routes.INSUFFICIENT_RIGHTS
//           }
//         />
//       }
//     />
//   )

//   //   return !isComponentAllowedToRender ? children : <Navigate to={redirectTo} />
// }
