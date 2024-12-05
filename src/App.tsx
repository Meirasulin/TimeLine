import { Routes, Route, BrowserRouter } from "react-router"
import Timeline1 from './component/TimeLine1'
import Timeline2 from "./component/Timeline2"
import { myEvents } from "./component/eventsList"
function App() {

  return (
<BrowserRouter>
<Routes>
  <Route element={<Timeline1/>} path='/timeLine1'/>
  <Route element={<Timeline2 events={myEvents}/>} path='/timeLine2'/>
</Routes>
</BrowserRouter>

  )
}

export default App
