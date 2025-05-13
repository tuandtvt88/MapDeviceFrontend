import { Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import { Tang1Beta } from "./components/Tang1Beta";
import  './components/App.css';
import { Tang2Beta } from "./components/Tang2Beta";
import { Tang3Beta } from "./components/Tang3Beta";
import { Tang4Beta } from "./components/Tang4Beta";
import { Tang5Beta } from "./components/Tang5Beta";
import { Tang1Gamma } from "./components/Tang1Gamma";
import { Tang2Gamma } from "./components/Tang2Gamma";
import { Tang3Gamma } from "./components/Tang3Gamma";
import { Tang4Gamma } from "./components/Tang4Gamma";
import { Tang5Gamma } from "./components/Tang5Gamma";
import { ThongKeWiFi } from "./components/ThongKeWiFi";
import { Tang1NCVso5 } from "./components/Tang1NCVso5";
import { Tang2NCVso5 } from "./components/Tang2NCVso5";
import { Tang1NCVso6 } from "./components/Tang1NCVso6";
import { Tang2NCVso6 } from "./components/Tang2NCVso6";
import { Tang1NCVso7 } from "./components/Tang1NCVso7";
import { Tang2NCVso7 } from "./components/Tang2NCVso7";
import { KTXDomB } from "./components/KTXDomB";
import { KTXDomA } from "./components/KTXDomA";
import { Vovinam } from "./components/Vovinam";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} >
        <Route path="tang1beta" element={<Tang1Beta/>}></Route>
        <Route path="tang2beta" element={<Tang2Beta/>}></Route>
        <Route path="tang3beta" element={<Tang3Beta/>}></Route>
        <Route path="tang4beta" element={<Tang4Beta/>}></Route>
        <Route path="tang5beta" element={<Tang5Beta/>}></Route>
        <Route path="tang1gamma" element={<Tang1Gamma/>}></Route>
        <Route path="tang2gamma" element={<Tang2Gamma/>}></Route>
        <Route path="tang3gamma" element={<Tang3Gamma/>}></Route>
        <Route path="tang4gamma" element={<Tang4Gamma/>}></Route>
        <Route path="tang5gamma" element={<Tang5Gamma/>}></Route>
        <Route path="tang1ncvso5" element={<Tang1NCVso5/>}></Route>
        <Route path="tang2ncvso5" element={<Tang2NCVso5/>}></Route>
        <Route path="tang1ncvso6" element={<Tang1NCVso6/>}></Route>
        <Route path="tang2ncvso6" element={<Tang2NCVso6/>}></Route>
        <Route path="tang1ncvso7" element={<Tang1NCVso7/>}></Route>
        <Route path="tang2ncvso7" element={<Tang2NCVso7/>}></Route>
        <Route path="ktxdomb" element={<KTXDomB/>}></Route>
        <Route path="ktxdoma" element={<KTXDomA/>}></Route>
        <Route path="vovinam" element={<Vovinam/>}></Route>
        <Route path="thongke" element={<ThongKeWiFi/>}></Route>
        </Route>
    </Routes>
  );
}

export default App;
