import { RouterProvider } from "react-router-dom"
import Loader from "./component/common/Loader"
import { router } from "./router/Route"

function App() {

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
