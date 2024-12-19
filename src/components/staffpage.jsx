import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Branches } from "../helpers/Branches";
import { AiOutlineRight } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { BsPersonCheck } from "react-icons/bs";
import { PiBuildingsBold } from "react-icons/pi";
import { MdOutlineEdit, MdOutlineTimerOff } from "react-icons/md";
import { MdArrowBackIosNew } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { TitleAndSearch } from "./branchDetails";
import { StudentSection } from "./branchDetails";
import { useStores } from "../store/index";
import { useObserver } from "mobx-react";
import { IoMdTime } from "react-icons/io";

export default function StaffPage() {
  const { UserStore } = useStores();
  const { branch } = useParams();
  const [searchvalue, setSearchvalue] = useState(null);




  const handleSearchInputChange = (value) => {
    setSearchvalue(value);
  }



  useEffect(() => {
    UserStore.getStudentsfromapi();
    UserStore.getPrincipalfromapi();
  });

  return useObserver(() => (
    <div>
      <div className="w-[100%]  flex flex-col bg-gray-100">
        {/* search box */}

        <TitleAndSearch onStaff={true} branch1={branch} onSearchChange={handleSearchInputChange} />
        {/* Student-list-section */}
        <div className="bg-white  drop-shadow my-6 mt-4 shadow-lg w-[90%] py-3 mx-auto rounded-lg">
          <StudentSection onstaff={true} searchvalue={searchvalue} />
        </div>
      </div>
    </div>
  ));
}
