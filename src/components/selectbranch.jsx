// import Home from "./home";
import { useEffect, useState } from "react";
import logo from "../assets/logo.jpeg";
import { PiStudentDuotone } from "react-icons/pi";
import {
  GiBirdHouse,
  GiElectric,
  GiCircuitry,
  GiBlockHouse,
  GiHouse,
  GiDogHouse,
  GiFamilyHouse,
} from "react-icons/gi";
import { IoBuild } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useStores } from "../store/index";

export default function Selectbranch() {
  const navigate = useNavigate();
  const { UserStore } = useStores();
  //   const [branch, setBranch] = useState("");

  const goToHomePage = () => {
    if (UserStore.user?.department === "Mech" && UserStore.user?.isVerified === true) {
      navigate("/Mech/staffpage");
    } else {
      alert("You are not authorized to access this page.")
    }
  };

  const goToHomePage1 = () => {
    if (UserStore.user?.department === "ECE" && UserStore.user?.isVerified === true) {
      navigate("/ECE/staffpage");
    }
    else {
      alert("You are not authorized to access this page. ")
    }
  };

  const goToHomePage2 = () => {
    if (UserStore.user?.department === "EEE" && UserStore.user?.isVerified === true) {
      navigate("/EEE/staffpage");
    }
    else {
      alert("You are not authorized to access this page.")
    }
  };

  const goToHomePage3 = () => {
    if (UserStore.user?.department === "Civil" && UserStore.user?.isVerified === true) {
      navigate("/Civil/staffpage");
    }
    else {
      alert("You are not authorized to access this page.")
    }
  };

  return (
    <div className="flex flex-col w-[100%]  h-screen items-center ">
      <div className="h-[30%] mt-[10%] md:mt-[2%]">
        <img src={logo} className="w-32 h-32 " alt="" />
      </div>

      <div className="bg-primary p-6 h-[70%]  w-[100%] rounded-tl-[100px] mt-[20%] md:mt-[10%]  items-center justify-center">
        <h1 className="text-3xl text-center py-2 text-white">Select Branch</h1>

        <div className="flex flex-wrap items-center my-6  justify-center">
          <div
            className="w-[120px] h-[120px] mx-4  my-10 flex flex-col items-center justify-center bg-white"
            onClick={goToHomePage}
          >
            <IoBuild className="text-6xl my-1 text-black" />
            <h1 className="text-base ">Mechanical</h1>
          </div>
          <div
            onClick={goToHomePage1}
            className="w-[120px] h-[120px] mx-4 my-10 flex flex-col items-center justify-center bg-white"
          >
            <GiCircuitry className="text-6xl my-1 text-black" />
            <h1 className="text-base ">Electronics</h1>
          </div>
          <div
            onClick={goToHomePage2}
            className="w-[120px] h-[120px] mx-4 my-10 flex flex-col items-center justify-center bg-white"
          >
            <GiElectric className="text-6xl my-1 text-black" />
            <h1 className="text-base ">Electrical</h1>
          </div>
          <div
            onClick={goToHomePage3}
            className="w-[120px] h-[120px] mx-4 my-10 flex flex-col items-center justify-center bg-white"
          >
            <GiFamilyHouse className="text-6xl my-1 text-black" />
            <h1 className="text-base ">Civil</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
