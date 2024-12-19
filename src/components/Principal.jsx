import { AiOutlineRight, AiOutlineSearch } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { Branches } from "../helpers/Branches";
import { useEffect, useState } from "react";
import { useStores } from "../store/index";
import { useObserver } from "mobx-react";
export default function Principal() {
  const {UserStore} = useStores();
  useEffect(() =>{
    UserStore.getLecturersfromapi();
    UserStore.getStudentsfromapi();
  },[])
  return useObserver(() => (
    <div className="w-[100%] my-1 h-screen flex flex-col no-scrollbar ">
      <div className="w-[90%] h-[12%] flex sticky flex-row mx-auto justify-between items-center">
        <Navbar />
      </div>
   
      <div className="w-[100%]  no-scrollbar md:w-[95%] md:pt-[2%] md:my-[1%] md:rounded-lg md:mx-auto md:bg-primary  flex flex-col md:flex-row md:overflow-y-visible  overflow-y-auto ">
          <Branch />
          <Approvals />
        </div>
      
    </div>
  ));
}

export function Navbar() {
  const { UserStore } = useStores();
  const now = new Date();
  const hours = now.getHours();
  const navigate = useNavigate();
  const defaultprofile = "https://ih1.redbubble.net/image.1046392278.3346/pp,504x498-pad,600x600,f8f8f8.jpg";
  // const [greeting, setGreeting] = useState(null);
  let greeting = null;

  if (hours >= 5 && hours < 12) {
    // setGreeting("Good Morning");
    greeting = "Good Morning";
  } else if (hours >= 12 && hours < 17) {
    // setGreeting("Good Afternoon");
    greeting = "Good Afternoon";
  } else if (hours >= 17 && hours < 21) {
    // setGreeting("Good Evening");
    greeting = "Good Evening";
  } else {
    // setGreeting("Good Night");
    greeting = "Good Night";
  }

  const goToProfile = () => {
    navigate("/profile");
  };

  return useObserver(() => (
    <div className="flex flex-row justify-between md:justify-end w-[100%]">
      <div className="flex  flex-col items-start md:mr-[2%]">
        <p className="text-text_color2 text-xl">{greeting}..!</p>
        <h1 className="text-2xl">{UserStore?.user?.name}</h1>
      </div>
      <div className="w-12 h-12 rounded-full overflow-hidden"
        style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
      >
        <img
          src={UserStore?.user?.photo}
          onClick={goToProfile}
          className="w-12 h-12 rounded-full"
          alt=""
        />
      </div>
    </div>
  ));
}

export function Branch() {
  const navigate = useNavigate();
  const { UserStore } = useStores();

  const goToSpecificBranch = (branch) => {
    navigate(`/principal/${branch}`);
  };

  const goToSearch = () => {
    navigate("/search");
  };

  const studentLength =(index)=>{
    if(index === 0){
      return UserStore.lengthOfMechStudents();
    }
    else if(index === 1){
      return UserStore.lengthOfEEEStudents();
    }
    else if(index === 2){
      return UserStore.lengthOfEceStudents();
    }
    else{
      return UserStore.lengthOfCivilStudents();
    }
  }

  const staffLength =(index)=>{
    if(index === 0){
      return UserStore.lengthOfMechStaff();
    }
    else if(index === 1){
      return UserStore.lengthOfEEEStaff();
    }
    else if(index === 2){
      return UserStore.lengthOfEceStaff();
    }
    else{
      return UserStore.lengthOfCivilStaff();
    }
  }

  return useObserver(() => (
    <div className="md:w-[55%] md:mx-auto">
      <div className="w-[85%] h-fit flex flex-col mx-auto">
        <div className="w-[100%] mt-[2%] flex flex-row mx-auto justify-between md:text-white items-center">
          <h1 className="text-2xl ">Select Branch</h1>
          <AiOutlineSearch onClick={goToSearch} className="text-2xl cursor-pointer" />
        </div>
      </div>
      <div className="w-full h-fit  my-3 flex flex-wrap  justify-between items-center">
        {Branches.map((item,index) => (
          <div
            className="w-[45%] md:w-[35%] h-[100%]  mx-auto pl-4  shade-sh my-5 flex flex-col items-start py-5  rounded-lg bg-white"
            onClick={() => goToSpecificBranch(item?.name)}
            key={index}
          >
            <div className="w-16 h-16  flex justify-center items-center rounded-full bg-primary2 my-1">
              {item?.icon}
            </div>
            <h1 className="text-lg pb-1 ">{item?.name}</h1>
            <p className="text-base  text-text_color2">
              Total Staff :{staffLength(index)} 
            </p>
            <p className="text-base  pb-1 text-green-400">
              Total Students :{studentLength(index)}
            </p>
          </div>
        ))}
        
        {/* <div className="w-[45%] h-[200px] mx-auto pl-4 shadow-md  shadow-[#000000] my-5 flex flex-col items-start py-2  rounded-lg bg-white">
                    <div className="w-16 h-16 rounded-full bg-primary2 my-1"  > </div>
                    <h1 className="text-lg pb-1">Electrical Engineering</h1>
                    <p className="text-base  text-text_color2">Total Staff : 34</p>
                    <p className="text-base pb-1 text-green-400">Total Students : 134</p>
                </div>
                <div className="w-[45%] h-[200px] mx-auto pl-4 shadow-md shadow-[#000000] my-5 flex flex-col items-start py-2  rounded-lg bg-white">
                    <div className="w-16 h-16 rounded-full bg-primary2
                            my-1"  > </div>
                    <h1 className="text-lg pb-1">Electronics Engineering</h1>
                    <p className="text-base  text-text_color2">Total Staff : 34</p>
                    <p className="text-base pb-1 text-green-400">Total Students : 134</p>
                </div>
                <div className="w-[45%]  h-[200px] mx-auto pl-4 shadow-md shadow-[#000000] my-5 flex flex-col items-start py-2  rounded-lg bg-white">
                    <div className="w-16 h-16 rounded-full bg-primary2 my-1"  > </div>
                    <h1 className="text-lg pb-1 ">Civil Engineering</h1>
                    <p className="text-base  text-text_color2">Total Staff : 34</p>
                    <p className="text-base pb-1 text-green-400">Total Students : 134</p>
                </div> */}
      </div>
    </div>
  ));
}

export function Approvals() {
  const { branch } = useParams();
  const navigate = useNavigate();
  const [lecturerApprovals, setLecturerApprovals] = useState([]);
  const [studentApprovals, setStudentApprovals] = useState([]);
  const { UserStore, CommonStore} = useStores();
  const defaultprofile = "https://t3.ftcdn.net/jpg/00/64/67/80/240_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg";




  //check verification status
  useEffect(() => {
    try {
      if (CommonStore.role === "principal") {
        const notverifiedLecturers = UserStore?.lecturers.filter(
          (lecturer) => lecturer?.isVerified === false
        );
        setLecturerApprovals(notverifiedLecturers);
      }
      else if (CommonStore.role === "hod" || CommonStore.role === "staff") {
        const notverifiedStudents = UserStore?.students.filter(
          (student) => student?.department.toUpperCase() === branch.toUpperCase() && student?.isVerified === false
        );
        setStudentApprovals(notverifiedStudents);
      }
      else { }
    } catch (error) {

    }
  }, [UserStore?.lecturers, UserStore?.students]);







  console.log(CommonStore.role);
  const viewStaffDetails = (id) => {
    navigate(`/staff/${id}`);
  };


  const viewStudentDetails = (pin) => {
    return navigate(`/${UserStore.user?.department}/studentapproval/${pin}`);
  };

  return useObserver(() => (
    <div className="bg-secondary w-[95%]  md:w-[35%] md:h-fit py-3 mx-auto rounded-lg">
      {CommonStore.role === "principal" ? (
        <>
          <h1 className="text-text_color1 font-semibold w-[90%] mx-auto text-3xl">
            Lecturer Approvals
          </h1>
          {
            lecturerApprovals.length === 0 ? (
              <h1 className="font-semibold w-[90%] text-lg py-10 mx-auto text-center">
                No Lecturer Approvals
              </h1>
            ) : (
              lecturerApprovals.map((lecturer) => (
                <div className="w-[90%] p-2 border-b-2 border-black mx-auto my-2 flex flex-row items-end justify-between">
                  <div className="flex flex-row items-center">
                    <div className="w-12 h-12 rounded-full"
                      style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} >
                      <img
                        src={lecturer?.photo}
                        className=" rounded-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col items-start ml-3">
                      <h1 className="text-lg">{lecturer?.name}</h1>
                      <p className="text-base">{lecturer?.idno}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <button
                      className="flex items-center justify-center"
                      onClick={() => viewStaffDetails(lecturer?._id)}
                    >
                      view details{" "}
                      <AiOutlineRight className="text-sm ml-1 mt-1" />{" "}
                    </button>
                  </div>
                </div>
              ))
            )
          }
        </>
      ) : (
        <>
          <h1 className="text-text_color1 font-semibold w-[90%] mx-auto text-3xl">
            Student Approvals
          </h1>
          {
            studentApprovals.length === 0 ? (
              <h1 className="font-semibold w-[90%] text-lg py-10 mx-auto text-center">
                No Student Approvals
              </h1>
            ) : (
              studentApprovals.map((student) => (
                <div className="w-[90%] p-2 border-b-2 border-black mx-auto my-2 flex flex-row items-end justify-between">
                  <div className="flex flex-row items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden"
                     style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} >
                    <img
                      src={student?.photo}
                      className="object-cover rounded-full"
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
                      onClick={() => viewStudentDetails(student?._id)}
                    >
                      view details <AiOutlineRight className="text-sm ml-1 mt-1" />{" "}
                    </button>
                  </div>
                </div>
              ))
            )
          }
        </>
      )}
    </div>
  ));
}
