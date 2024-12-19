// import Home from "./home";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import principal from "../assets/principal.jpeg"
import hod from "../assets/hod.jpeg"
import staff from "../assets/staff.jpeg"
import student from "../assets/student.jpeg"
import { PiStudentDuotone } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useStores } from "../store/index";

export default function HomePage() {
  const [showHome, setShowHome] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowHome(false);
    }, 3000);
  }, []);

  return { showHome } ? <Category /> : <Home />;
}
export function Home() {
  return (
    <div className="flex h-screen flex-col items-center  justify-center bg-white">
      <img src={logo} alt="sbtet" className="w-32 h-32 rounded-full" />
      <h1 className="text-4xl  ">GPT Pendurthi</h1>
    </div>
  );
}

export function Category() {
  const navigate = useNavigate();
  const { CommonStore } = useStores();

  const goToLogin = () => {
    CommonStore.setRole("principal");
    navigate("/login");
  };
  const goToLogin1 = () => {
    CommonStore.setRole("hod");
    navigate("/login");
  };
  const goToLogin2 = () => {
    CommonStore.setRole("staff");
    navigate("/login");
  };
  const goToLogin3 = () => {
    CommonStore.setRole("student");
    navigate("/login");
  };

  return (
    <div className="flex flex-col w-[100%]  h-screen overflow-hidden items-center ">
      <div className="h-[30%] mt-[10%] md:mt-[5%]">{Logo()}</div>

      <div className="bg-primary p-6 h-[70%] md:w-[80%] lg:w-[70%]  w-[100%] rounded-tl-[100px] md:rounded-tl-none lg:rounded-tl-none mt-[20%] md:mt-[5%]  items-center justify-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-center py-2 md:py-1 lg:py-2 text-white">
          Select User Type
        </h1>

        <div className="flex flex-wrap items-center my-6 md:my-[3%] lg:my-[6%] justify-center">
          <div
            className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px] md:mx-8  mx-4  my-10  flex flex-col items-center justify-center bg-white"
            onClick={goToLogin}
          >
            <img src={principal} alt="" />
            <h1 className="text-base md:text-xl ">Principal</h1>
          </div>
          <div
            onClick={goToLogin1}
            className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] md:mx-8 mx-4 my-10 flex flex-col items-center justify-center bg-white"
          >
            <img src={hod} alt="" />
            <h1 className="text-base md:text-xl ">H.O.D</h1>
          </div>
          <div
            onClick={goToLogin2}
            className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] md:mx-8 mx-4 my-10 flex flex-col items-center justify-center bg-white"
          >
            <img src={staff} alt="" />
            <h1 className="text-base md:text-xl ">Staff</h1>
          </div>
          <div
            onClick={goToLogin3}
            className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] md:mx-8 mx-4 my-10 flex flex-col items-center justify-center bg-white"
          >
            <img src={student} alt="" />
            <h1 className="text-base md:text-xl ">Student</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Logo() {
  return (
    <img
      src={logo}
      className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 "
      alt=""
    />
  );
}
