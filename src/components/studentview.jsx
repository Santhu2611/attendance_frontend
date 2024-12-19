// import { MdOutlineArrowBackIosNew } from "react-icons/md";
import CertificateList from "./CertificateList";
import { Branches } from "../helpers/Branches";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineClose, AiOutlineLeft } from "react-icons/ai";
import { useStores } from "../store/index";
import { useObserver } from "mobx-react";
import { MdDeleteOutline, MdOutlineEdit, MdOutlineAddToHomeScreen, MdOutlineTimerOff } from "react-icons/md";
import { PiBuildingsBold } from "react-icons/pi";
import { BiLogOut } from "react-icons/bi";
import { IoMdAdd, IoMdAddCircle, IoMdTime } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import Loader from "./reusable_Components/loader";


export default function Studentview() {
  const { UserStore, CommonStore, AccessStore } = useStores();
  const [loading, setLoading] = useState(false);
  const { branch, id } = useParams();
  const [editForm, setEditForm] = useState(false);
  const [deleteForm, setDeleteForm] = useState(false);
  const defaultprofile = "https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";
  const fileInputRef = useRef(null);
  const nameref = useRef(null);
  const pinref = useRef(null);
  const emailref = useRef(null);
  const branchref = useRef(null);
  const phoneref = useRef(null);
  const [showError, setShowError] = useState(false);
  const expiryDateref = useRef(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [uploadForm, setUploadForm] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  // const selectedBranch = Branches.find(
  //   (branchname) => branchname.name === branch
  // );

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
      } else {
        // If the target time has passed, clear the interval and set timeLeft to a message
        clearInterval(intervalId);
        setTimeLeft("No access");
      }
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [UserStore.user?.access?.expiresAt]);


  const selectedStudent = UserStore?.students.find(
    (student) => student?._id === id
  );

  const autofillref = () => {
    try {
      nameref.current.value = selectedStudent?.name;
      pinref.current.value = selectedStudent?.pinno;
      emailref.current.value = selectedStudent?.emailid;
      branchref.current.value = selectedStudent?.department;
      phoneref.current.value = selectedStudent?.studentmobile;
    } catch (error) {

    }
  };

  useEffect(() => {
    autofillref();
    UserStore.getPrincipalfromapi();
  }, [editForm, uploadForm]);


  const updateStudentDetails = async (id) => {
    try {
      const name = nameref.current.value;
      const pinno = pinref.current.value;
      const emailid = emailref.current.value;
      const department = branchref.current.value;
      const studentmobile = phoneref.current.value;

      await UserStore.updateStudents(name, pinno, emailid, studentmobile, department, id);
      setEditForm(false);
      setUploadForm(false);
    } catch (error) {

    }
  };

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    UserStore.user = null;
    UserStore.setPrincipalAuth(false);
    UserStore.setHodAuth(false);
    UserStore.setStudentAuth(false);
    CommonStore.setRole(null);
    navigate("/welcome");
  };

  const editAccess = () => {
    if (UserStore.user?.access?.granted) {
      setEditForm(true)
    }
    else {
      setShowError(true)
    }
  }

  const uploadFilesForm = () => {
    if (UserStore.user?.access?.granted) {
      setUploadForm(true)
    }
    else {
      setShowError(true)
    }
  }

  const deleteAccess = () => {
    if (UserStore.user?.access?.granted) {
      setDeleteForm(true)
    }
    else {
      setShowError(true)
    }
  }

  const Navbar = () => {
    if (CommonStore.role === "principal") {
      return (
        <button
          className="flex items-center w-[20%] mx-4 text-white text-lg"
          onClick={showBranch}
        >
          <AiOutlineLeft className="mr-1" /> Back
        </button>
      );
    } else if (CommonStore.role === "hod" || CommonStore.role === "staff") {
      return (
        <div className="flex justify-between w-[95%] items-center">
          <button
            className="flex items-center w-[20%] mx-4 text-white text-lg"
            onClick={showBranch}
          >
            <AiOutlineLeft className="mr-1" /> Back
          </button>
          <div className="flex">
            <button
              onClick={uploadFilesForm}
              className="w-10 h-10 bg-white rounded-full mx-2 text-2xl text-black flex items-center justify-center">
              <MdOutlineAddToHomeScreen />
            </button>
            <button
              onClick={editAccess}
              className="w-10 h-10 bg-white rounded-full mx-2 text-2xl text-black flex items-center justify-center"
            >
              <MdOutlineEdit />
            </button>
            <button
              onClick={deleteAccess}
              className="w-10 h-10 bg-white rounded-full mx-3 text-2xl text-black flex items-center justify-center"
            >
              <MdDeleteOutline />
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex justify-end w-[95%] items-center">
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 bg-white rounded-full mx-2 text-2xl text-black flex items-center justify-center"
          >
            {" "}
            <PiBuildingsBold />
          </button>
          <button
            onClick={logout}
            className="w-10 h-10 bg-white rounded-full mx-2 text-2xl text-black flex items-center justify-center"
          >
            {" "}
            <BiLogOut />
          </button>
        </div>
      );
    }
  };

  const removeStudent = async (id) => {
    await UserStore.deleteStudents(id);
    setDeleteForm(false);
    navigate(`/${UserStore.user?.department}/staffpage`);
  };

  const showBranch = () => {
    if (CommonStore.role === "principal") {
      navigate(`/principal/${branch}`);
    } else {
      navigate(`/${branch}/staffpage`);
    }
  };

  const openFiles = () => {
    fileInputRef.current.click();
  };

  const uploadImageToFirebase = async (file) => {

    const timeStamp = new Date().valueOf();
    const storageRef = ref(storage, `images/${timeStamp}-${file.name}`);
    try {
      setLoading(true);
      await uploadBytes(storageRef, file);
      console.log('Image uploaded to Firebase Storage');
      const imageURL = await getDownloadURL(storageRef);
      console.log(imageURL);
      await UserStore.updateStudentImage(imageURL, CommonStore.role === "student" ? UserStore.user?._id : selectedStudent?._id);
      setLoading(false);
    } catch (error) {

    }
  };

  const navigateToRoute = () => {
    if (CommonStore.role === "student") {
      navigate(`/biodata/${UserStore.user?._id}`);
    } else {
      navigate(`/${selectedStudent?.department}/${selectedStudent?._id}/biodata`);
    }
  };

  const changeImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImageToFirebase(file);
    }
  };

  const giveAccess = async (id) => {
    const dateString = expiryDateref.current.value;
    // const dateObject = new Date(dateString);
    console.log(dateString)
    const date1 = new Date(dateString);

   
    const timestamp =  date1.toISOString();

    console.log('Converted Timestamp:', timestamp);


    await AccessStore.AccessStudents(timestamp, id);
    date1.setHours(date1.getHours() + 5);
    date1.setMinutes(date1.getMinutes() + 30);
    const timestamp1 = date1.toISOString();
    setExpiryDate(timestamp1)
    setUploadForm(false)
  }

  const falseUpload = () => {
    setUploadForm(false)
  }

  useEffect(() => {
    const date = new Date(selectedStudent?.access?.expiresAt).toLocaleString('en-US', {
      timeZone: 'UTC',
    });
  }, [selectedStudent])

  return useObserver(() => (
    <div className="w-[100%] h-full">
      {loading && <Loader loader={true} />}
      <div className="pb-10 pt-6 flex flex-col items-start w-full bg-primary rounded-b-2xl">
        <Navbar />
        {showError && <p className="text-red-500 font-semibold w-[90%] mx-auto mt-2">! You don't have access to edit the details</p>}
        <div className="pb-2 w-[85%] mx-auto items-center flex mt-4">
          {CommonStore.role === "student" && !UserStore.user?.photo ? (
            <div onClick={openFiles} className="bg-secondary cursor-pointer text-primary my-6 w-36 h-44 rounded-lg flex flex-col items-center justify-center">
              <IoMdAdd className="text-6xl" />
              <p className="py-1 text-lg">Add Image</p>
              <input
                type="file"
                id="fileInput"
                ref={fileInputRef}
                className="hidden"
                onChange={changeImage}
              />
            </div>
          ) :
            <div className="h-44 w-36 rounded-lg relative overflow-hidden"
              style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
            >
              <img
                src={
                  CommonStore.role === "student"
                    ? UserStore.user?.photo
                    : selectedStudent?.photo
                }
                className="h-full w-full object-cover rounded-lg"
                alt=""
              />
              {CommonStore.role !== "principal" &&
                <span onClick={openFiles} className="bg-primary w-6 absolute z-auto cursor-pointer left-[85%] top-0 h-6 rounded-full flex items-center justify-center">
                  <MdOutlineEdit className=" text-white" />
                  <input type="file" id="fileinput" className="hidden" ref={fileInputRef} onChange={changeImage} />
                </span>}
            </div>
          }
          <div className="ml-6 text-white w-[50%] break-words">
            <h1 className="text-xl pb-1 ">
              {CommonStore.role === "student"
                ? UserStore.user?.name
                : selectedStudent?.name}
            </h1>
            <p className="text-base ">
              {CommonStore.role === "student"
                ? UserStore.user?.pinno
                : selectedStudent?.pinno}
            </p>
            <p className="text-base">
              {CommonStore.role === "student"
                ? `${UserStore.user?.department} , ${UserStore.user?.semister}`
                : `${selectedStudent?.department} , ${selectedStudent?.semister}`}
            </p>
            <p className="text-base">
              {CommonStore.role === "student"
                ? UserStore.user?.studentmobile
                : selectedStudent?.studentmobile}
            </p>
            <p className="text-base pb-1">
              {CommonStore.role === "student"
                ? UserStore.user?.emailid
                : selectedStudent?.emailid}
            </p>
            <button onClick={navigateToRoute} className="bg-white text-black rounded-lg p-1">
              View Biodata
            </button>
          </div>
        </div>
      </div>
      <div className="flex ml-6 mt-4 space-x-10 ">
        <div className="h-16 w-36 bg-primary rounded-lg">
          <p className="text-lg ml-2 text-white">Sem Percentage</p>
          <p className="text-white ml-14">
            {CommonStore.role === "student"
              ? UserStore.user?.percentage
              : selectedStudent?.percentage}{" "}
            %
          </p>
        </div>
        <div className="h-16 w-36 bg-primary rounded-lg">
          <p className="text-lg ml-9 text-white">Backlogs</p>
          <p className="text-white ml-16">
            {CommonStore.role === "student"
              ? UserStore.user?.backlogs
              : selectedStudent?.backlogs}
          </p>
        </div>
      </div>
      {(CommonStore.role === "hod" || CommonStore.role === "staff") && UserStore.user?.access?.granted &&
        <div className="flex flex-col mt-2 w-[90%] mx-auto items-start">

          <p>Access granted till {expiryDate}</p>
        </div>
      }

      <div className="bg-white  drop-shadow my-6 shadow-lg w-[90%] py-3 mx-auto rounded-lg">

        {CommonStore.role !== "principal" ? (
          <div className="flex w-[90%] justify-between items-center mt-2 mx-auto">
            <h2 className="text-2xl text-text_color1 font-semibold">
              Certificates
            </h2>
           {timeLeft === "No access" ? null : <button
              className="flex text-xs text-text_color1 items-center cursor-pointer"
              onClick={() => UserStore.user?.access?.granted ? navigate(`/${branch}/${CommonStore.role === "student" ? UserStore.user?._id : selectedStudent?._id}/certificate`) : setShowError(true)}
            >
              <IoMdAddCircle className="text-base" />
              Add new Certificate
            </button>}
          </div>
        ) : (
          <h1 className="text-text_color1 font-semibold w-[90%] mx-auto text-2xl">
            Certificates
          </h1>
        )}
        {CommonStore.role === "student" && <p className="bg-black text-white flex items-center justify-center p-1 opacity-80 rounded-lg w-[40%] ml-auto mr-4 mt-2 ">{timeLeft === "No access" ? <MdOutlineTimerOff className="mr-1" /> : <IoMdTime className="mr-1" />} {timeLeft}</p>}

        <CertificateList />
      </div>
      {
        deleteForm ? (
          <div className="fixed inset-0  w-[80%] m-auto h-[20%] flex flex-col z-50 py-4 px-2 rounded-2xl items-center  bg-primary" >
            <h1 className="text-center text-2xl text-white">Confirm to delete</h1>
            <p className="text-white pt-1 text-2xl">{selectedStudent?.name}</p>
            {/* <AiOutlineClose onClick={() => setDeleteForm(false)} className="absolute text-white text-2xl cursor-pointer right-2 top-4" /> */}
            <div className="w-[90%] mx-auto flex my-3  justify-between items-center" >
              <button
                onClick={() => setDeleteForm(false)}
                className="flex w-[40%] mx-auto text-xl justify-between bg-white rounded-lg  text-black items-center p-2"
              >
                Cancel
                <AiOutlineClose className="mx-1" />
              </button>
              <button
                onClick={() => removeStudent(selectedStudent?._id)}
                className="flex w-[40%] mx-auto text-xl justify-between bg-white rounded-lg text-black items-center p-2">
                Delete
                <MdDeleteOutline className="mx-1" />
              </button>
            </div>
          </div >
        ) : null
      }
      {
        editForm ? (
          <div className="fixed inset-0 w-[90%] m-auto h-[80%] flex flex-col z-50 py-4 px-2 rounded-2xl justify-center  bg-primary">
            <h1 className="text-center text-lg text-white">Edit Details </h1>

            <AiOutlineClose
              onClick={() => setEditForm(false)}
              className="absolute text-white text-2xl cursor-pointer right-2 top-4"
            />
            <div
              className="flex flex-col w-[95%] mx-auto h-full"
            >
              <div className="flex flex-col mt-2">
                <label className="pb-2 text-white">Name</label>
                <input
                  required
                  ref={nameref}
                  type="text"
                  className="bg-primary mb-1 px-1 text-white text-opacity-80 text-lg focus:outline-none border-b-2 border-[rgba(255, 255, 255, 1)]"
                />
              </div>
              <div className="flex flex-col mt-1">
                <label className="pb-2 text-white">Pin Number</label>
                <input
                  required
                  ref={pinref}
                  type="text"
                  className="bg-primary mb-1 px-1 text-white text-lg text-opacity-80 focus:outline-none border-b-2 border-[rgba(255, 255, 255, 1)]"
                />
              </div>
              <div className="flex flex-col mt-1">
                <label className="pb-2 text-white">E-mail</label>
                <input
                  required
                  ref={emailref}
                  type="text"
                  className="bg-primary mb-1 px-1 text-white text-lg text-opacity-80 focus:outline-none border-b-2 border-[rgba(255, 255, 255, 1)]"
                />
              </div>
              <div className="flex flex-col mt-1">
                <label className="pb-2 text-white">Phone Number</label>
                <input
                  required
                  ref={phoneref}
                  type="text"
                  className="bg-primary mb-1 px-1 text-white text-lg text-opacity-80 focus:outline-none border-b-2 border-[rgba(255, 255, 255, 1)]"
                />
              </div>
              <div className="flex flex-col mt-1">
                <label className="pb-2 text-white">Branch</label>
                <select
                  required
                  ref={branchref}
                  type="text"
                  className="w-[70%] mb-1 rounded-lg px-1 bg-white text-opacity-80  text-lg focus:outline-none  "
                >
                  <option className="text-xs" value="Mech">
                    Mechanical Engineering
                  </option>
                  <option className="text-xs" value="EEE">
                    Electrical and Electronics Engineering
                  </option>
                  <option className="text-xs" value="ECE">
                    Electronics and Communication Engineering
                  </option>
                  <option className="text-xs" value="Civil">
                    Civil Engineering
                  </option>
                </select>
              </div>

              <button
                onClick={() => updateStudentDetails(selectedStudent?._id)}
                className="absolute right-6 bottom-4 px-8 py-1 bg-black text-white rounded-lg text-base"
              >
                Save
              </button>
            </div>
          </div>
        ) : null
      }
      {
        uploadForm ? (
          <div className="fixed bg-white inset-0 w-[90%] m-auto h-[25%] flex flex-col z-50 py-4 px-2 shadow-2xl rounded-2xl  ">
            <div className="w-[90%] h-full mx-auto flex flex-col items-center">
              <h1 className="text-xl">Give Access</h1>
              <input ref={expiryDateref} type="datetime-local" className="text-base px-4 py-2 mt-4  border-2 rounded-lg border-black" />
              <p className="text-xs mt-6">By giving access the user can upload the certificates</p>
              <div className="flex mt-1 w-[60%] justify-between">
                <button onClick={() => giveAccess(selectedStudent?._id)} className="text-justify hover:bg-primary border border-primary hover:text-white py-1  px-6 rounded">Yes</button>
                <button onClick={falseUpload} className="text-justify py-1 hover:bg-primary border border-primary hover:text-white  px-6 rounded">No</button>
              </div>
            </div>
          </div>
        ) : null
      }
    </div >
  ));
}
