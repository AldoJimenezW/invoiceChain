import React, { useEffect } from "react"
import { authClient } from "../lib/auth-client"
type Props = {
  element: React.ReactNode
}

const PrivateRoute = (props: Props) => {

  const { data } = authClient.useSession();

  // Check user role on component mount
  useEffect(() => {
    if (data) {
      console.log(data)
    }
  }, [data])
  // if (session.isPending) return <div className="p-6">Loading!</div>
  // if (!session.data?.user.id) {
  //   return (
  //     <div className="p-6">
  //       <div className="flex items-center">
  //         <h1>Error</h1>
  //       </div>
  //       <p>This page is private.</p>
  //     </div>
  //   )
  // }
  // return <>{props.element}</>
  return (
    <div className="p-6">
      <div className="flex items-center">
        <h1>Error</h1>
      </div>
    </div>
  )
}

export default PrivateRoute