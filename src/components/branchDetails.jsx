import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { IoMdAddCircle, IoMdTime } from "react-icons/io";
// import { Lectures } from '../helpers/lectures';
// import { MechStudents } from '../helpers/MechStudents';
import { Branches } from "../helpers/Branches";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { PiBuildingsBold } from "react-icons/pi";
import { BsPersonCheck } from "react-icons/bs";
import { useStores } from "../store/index";
import { useObserver } from "mobx-react";
import { MdOutlineTimerOff } from "react-icons/md";
import AccessStore from "../store/access_store";

export default function BranchDetails() {
  const [searchvalue, setSearchvalue] = useState(null);
        const storageTime = localStorage.getItem("time");


  const handleSearchInputChange = (value) => {
    setSearchvalue(value);
  }

  return useObserver(() => (
    <>
      <div className="w-[100%]  flex flex-col bg-gray-100">
        <TitleAndSearch onSearchChange={handleSearchInputChange} />
        {/* Lecturers section */}
        <div className="flex flex-col md:flex-row-reverse md:justify-between mx-auto w-[90%] md:w-[90%]">
          <div className=" mt-6 h-auto rounded-lg md:w-[35%] ">
            <LecturerSection searchvalue={searchvalue} />
          </div>
          {/* Student-list-section */}
          <div className="bg-white  drop-shadow-2xl my-6 shadow-lg md:w-[55%]  rounded-lg  ">
            <StudentSection searchvalue={searchvalue} />
          </div>
        </div>
      </div>
    </>
  ));
}

export function TitleAndSearch({ onStaff, onSearchChange }) {
  let { branch } = useParams();
  const { UserStore,AccessStore } = useStores();
  const searchref = useRef(null);
  const defaultprofile = "https://ih1.redbubble.net/image.1046392278.3346/pp,504x498-pad,600x600,f8f8f8.jpg";

  const selectedBranch = Branches.find(
    (branchname) => branchname.name === branch
  );

  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();;
      const timestamp = UserStore.user?.access?.expiresAt
      const targetTime = new Date(timestamp)
      // Calculate the difference in milliseconds
      const difference = targetTime - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(` ${hours}h ${minutes}m ${seconds}s`);
        AccessStore.setAccessTime(`${hours}h ${minutes}m ${seconds}s`)
      } else {
        // If the target time has passed, clear the interval and set timeLeft to a message
        clearInterval(intervalId);
        setTimeLeft("No access");
        AccessStore.setAccessTime("No access")
      }
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [UserStore.user?.access?.expiresAt]);

  const navigate = useNavigate();
  const gotoStudentApproval = () => {
    navigate(`/${branch}/studentapproval`);
  };

  const gotoProfile = () => {
    navigate(`/profile`);
  };

  const gotoHomePage = () => {
    navigate(`/principal`);
  };

  const showlecturerprofile = (id) => {
    navigate(`/${branch}/lecturer/${id}`);
  };

  const handleSearch = () => {
    const inputValue = searchref.current.value;
    if (inputValue === "") {
      onSearchChange(null);
    } else {
      onSearchChange(inputValue);
    }
  }

  return useObserver(() => (
    <div className="flex flex-col w-[90%] mx-auto md:w-[90%] md:flex-row md:justify-between">
      <div className="md:w-[55%]  pt-6 flex items-center">
        {!onStaff ? (
          <>
            {" "}
            <AiOutlineLeft className="text-lg  cursor-pointer" onClick={gotoHomePage} />
            <h2 className="mx-1 text-lg text-primary ">
              {selectedBranch?.name}
            </h2>
          </>
        ) : (
          <>
            <div className="mt-2 ml-auto flex">
              <div
                className="bg-secondary h-12 w-12 rounded-full mx-2"
                onClick={gotoStudentApproval}
              >
                <BsPersonCheck className="text-4xl ml-1 mt-1" />
              </div>
              <div
                className="bg-secondary h-12 w-12 rounded-full mx-2"
                onClick={gotoProfile}
              >
                <PiBuildingsBold className="text-3xl ml-2 mt-2" />
              </div>
              <div
                onClick={() => showlecturerprofile(UserStore.user?.idno)}
                className=" mx-2 pr-2"
              >
                <div className="h-12 w-12 rounded-full overflow-hidden"
                  style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
                >
                  <img
                    className="object-cover rounded-full"
                    src={UserStore.user?.photo}
                    alt=" "
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {onStaff && <p className="bg-black text-white flex items-center justify-center p-1 opacity-80 rounded-lg w-[40%] ml-auto mt-2 ">{timeLeft === "No access" ? <MdOutlineTimerOff className="mr-1" /> : <IoMdTime className="mr-1" />} {timeLeft}</p>}

      <div className="mt-4  relative w-[90%]  md:w-[35%] ">
        <input
          ref={searchref}
          type="text"
          placeholder="Search"
          className="pl-14 pr-4 py-4 w-full border-blue-400 border-2 rounded-full focus:outline-none"
          onChange={handleSearch}
        />
        <span className="absolute left-2 top-5  mx-4  ">
          <FaSearch className="text-lg" />
        </span>
      </div>
    </div>
  ));
}

export function LecturerSection({ searchvalue }) {
  const navigate = useNavigate();
  const { UserStore } = useStores();
  const [selectedBranchLecturers, setSelectedBranchLecturers] = useState([]);
  const defaultprofile = "https://ih1.redbubble.net/image.1046392278.3346/pp,504x498-pad,600x600,f8f8f8.jpg"
  let { branch } = useParams();



  //check verification
  useEffect(() => {
    try {
      if (searchvalue === null) {
        const verifiedLecturers = UserStore?.lecturers.filter(
          (lecturer) => lecturer?.department.toUpperCase() === branch.toUpperCase() && lecturer?.isVerified === true
        );
        setSelectedBranchLecturers(verifiedLecturers);
      } else {
        const verifiedLecturers = UserStore?.lecturers.filter(
          (lecturer) => lecturer?.department.toUpperCase() === branch.toUpperCase() && lecturer?.isVerified === true && (lecturer?.name.toLowerCase().includes(searchvalue.toLowerCase()) || lecturer?.idno.toLowerCase().includes(searchvalue.toLowerCase()))
        );
        setSelectedBranchLecturers(verifiedLecturers);
      }
    } catch (error) {
      console.log(error);
    }
  }, [UserStore?.lecturers, searchvalue]);



  const showLecturerDetails = (id) => {
    navigate(`/${branch}/lecturer/${id}`);
  };

  const addNewStaff = (branch) => {
    navigate(`/${branch}/newstaff`);
  };

  return useObserver(() => (
    <div className="bg-secondary py-4 rounded-lg">
      <div className=" flex w-[90%] justify-between items-center mt-2 mx-auto md:w-[75%]">
        <h2 className="text-2xl text-text_color1 font-semibold">Lecturers</h2>
        <button
          className="flex text-xs text-text_color1 items-center"
          onClick={() => addNewStaff(branch)}
        >
          <IoMdAddCircle className="text-base" />
          Add new Staff
        </button>
      </div>
      <div className="mt-4 w-[90%] mx-auto">
        <div className="flex overflow-x-auto items-center pb-4 md:grid md:grid-cols-3 md:gap-4">
          {
            selectedBranchLecturers.length === 0 ? (
              <h1 className="font-semibold w-[90%] text-lg py-10 mx-auto text-center">
                No Approved Lecturers
              </h1>
            ) : (
              selectedBranchLecturers.map((lecturer, index) => (
                <div
                  key={index}
                  onClick={() => showLecturerDetails(lecturer?._id)}
                  className="cursor-pointer mx-3 flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden"
                    style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
                  >
                    <img
                      src={lecturer?.photo}
                      alt=" "
                      className=" rounded-full object-cover w-full h-full"
                    />
                  </div>

                  <p className="text-black pt-1 md:w-28 text-center truncate">{lecturer?.name}</p>
                </div>
              ))
            )
          }
        </div>
      </div>
    </div>
  ));
}

export function StudentSection({ onstaff, searchvalue }) {
  let { branch } = useParams();
  const [selectedBranchStudents, setSelectedBranchStudents] = useState([]);
  const [firstYearStudents, setFirstYearStudents] = useState([]);
  const [secondYearStudents, setSecondYearStudents] = useState([]);
  const [thirdYearStudents, setThirdYearStudents] = useState([]);
  const { UserStore } = useStores();
  const [showError, setShowError] = useState(false);
  const defaultprofile = "https://ih1.redbubble.net/image.1046392278.3346/pp,504x498-pad,600x600,f8f8f8.jpg"


  //check verification 
  useEffect(() => {
    try {
      if (searchvalue === null) {
        const verifiedStudents = UserStore?.students.filter(
          (student) => student?.department.toUpperCase() === branch.toUpperCase() && student?.isVerified === true
        );
        setSelectedBranchStudents(verifiedStudents);
        const firstYearStudents = verifiedStudents.filter((student) => student?.semister === "1st Year");
        setFirstYearStudents(firstYearStudents);
        const secondYearStudents = verifiedStudents.filter((student) => student?.semister === "2nd Year");
        setSecondYearStudents(secondYearStudents);
        const thirdYearStudents = verifiedStudents.filter((student) => student?.semister === "3rd Year");
        setThirdYearStudents(thirdYearStudents);
      } else {
        const verifiedStudents = UserStore?.students.filter(
          (student) => (student?.department.toUpperCase() === branch.toUpperCase()) && (student?.isVerified === true) && (student?.name.toLowerCase().includes(searchvalue.toLowerCase()) || student?.pinno.toLowerCase().includes(searchvalue.toLowerCase()))
        );
        setSelectedBranchStudents(verifiedStudents);
      }
    } catch (error) {
      console.log(error);
    }
  }
    , [UserStore?.students, searchvalue]);

  const navigate = useNavigate();

  const showStudentDetails = (id) => {
    navigate(`/${branch}/${id}`);
  };

  const storageTime = localStorage.getItem("time");


  return useObserver(() => (
    <>
      {onstaff ? (
        <>
          <div className="flex w-[90%] justify-between items-center mt-2 mx-auto">
            <h2 className="text-2xl text-text_color1 font-semibold">
              Students
            </h2>
            {storageTime === "No access" ? null : <button
              className="flex text-xs text-text_color1 items-center"
              onClick={() => UserStore.user?.access?.granted ? navigate(`/${branch}/newstudent`) : setShowError(true)}
            >
              <IoMdAddCircle className="text-base" />
              Add new Student
            </button>
 }
          
          </div>
          {showError && <p className="text-red-500 font-semibold w-[90%] mx-auto mt-2">! You don't have access to edit the details</p>}
        </>
      ) : (
        <h1 className="text-text_color1 font-semibold w-[90%] mx-auto text-2xl my-4">
          Students
        </h1>
      )}
      {
        selectedBranchStudents.length === 0 ? (
          <h1 className=" font-semibold w-[90%] text-lg py-10 mx-auto text-center">
            No Approved Students
          </h1>
        ) : (
          <>
            {firstYearStudents.length === 0 ? null : <p className="text-primary font-bold w-[90%] mx-auto">Ⅰst Year</p>}
            {firstYearStudents.map((student) => (
              <>
                <div className="w-[90%] p-2 border-b-2 border-[rgba(0, 0, 0, 1)] mx-auto my-2 flex flex-row items-end justify-between">
                  <div className="flex flex-row items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden"
                      style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
                    >
                      <img
                        src={student?.photo}
                        className="object-cover rounded-full w-full h-full"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col items-start ml-3">
                      <h1 className="text-lg">{student?.name}</h1>
                      <p className="text-base">{student?.pinno}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <button
                      className="flex items-center justify-center"
                      onClick={() => showStudentDetails(student?._id)}
                    >
                      view details <AiOutlineRight className="text-sm ml-1 mt-1" />{" "}
                    </button>
                  </div>
                </div>
              </>
            ))}
            {secondYearStudents.length === 0 ? null : <p className="text-primary font-bold w-[90%] mx-auto">Ⅱnd Year</p>}
            {secondYearStudents.map((student) => (
              <>
                <div className="w-[90%] p-2 border-b-2 border-[rgba(0, 0, 0, 1)] mx-auto my-2 flex flex-row items-end justify-between">
                  <div className="flex flex-row items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden"
                      style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
                    >
                      <img
                        src={student?.photo}
                        className="object-cover rounded-full w-full h-full"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col items-start ml-3">
                      <h1 className="text-lg">{student?.name}</h1>
                      <p className="text-base">{student?.pinno}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <button
                      className="flex items-center justify-center"
                      onClick={() => showStudentDetails(student?._id)}
                    >
                      view details <AiOutlineRight className="text-sm ml-1 mt-1" />{" "}
                    </button>
                  </div>
                </div>
              </>
            ))}
            {thirdYearStudents.length === 0 ? null : <p className="text-primary font-bold w-[90%] mx-auto">Ⅲrd Year</p>}
            {thirdYearStudents.map((student) => (
              <>
                <div className="w-[90%] p-2 border-b-2 border-[rgba(0, 0, 0, 1)] mx-auto my-2 flex flex-row items-end justify-between">
                  <div className="flex flex-row items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden"
                      style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
                    >
                      <img
                        src={student?.photo}
                        className="object-cover rounded-full w-full h-full"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col items-start ml-3">
                      <h1 className="text-lg">{student?.name}</h1>
                      <p className="text-base">{student?.pinno}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <button
                      className="flex items-center justify-center"
                      onClick={() => showStudentDetails(student?._id)}
                    >
                      view details <AiOutlineRight className="text-sm ml-1 mt-1" />{" "}
                    </button>
                  </div>
                </div>
              </>
            ))}
          </>

        )
      }
    </>
  ));
}
