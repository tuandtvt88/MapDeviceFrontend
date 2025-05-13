import { Outlet } from "react-router-dom";
import './Main.css'
export function Main({ children }) {
    return (
      <div className="main"
      style={{
                        backgroundImage: `url(${require("../assets/Toancanhtruong.jpg")})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        minHeight: "80vh"
                    }}
                    >
        <Outlet/>
      </div>
    );
  }