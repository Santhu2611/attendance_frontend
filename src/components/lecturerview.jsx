import { useParams, useNavigate } from "react-router-dom";
import { Branches } from "../helpers/Branches";
import { AiOutlineClose, AiOutlineLeft } from "react-icons/ai";
import { MdDeleteOutline, MdOutlineAddToHomeScreen, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import { useStores } from "../store/index";
import { useObserver } from "mobx-react";
import { BiLogOut } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { toJS } from "mobx";
import Loader from "./reusable_Components/loader";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { IoIosArrowDown } from "react-icons/io";

export default function LecturerView() {
  const [editForm, setEditForm] = useState(false);
  const [deleteForm, setDeleteForm] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState({});
  const { UserStore, CommonStore, AccessStore } = useStores();
  const navigate = useNavigate();
  const { branch, id } = useParams();
  const defaultprofile = "https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false)
  const expiryDateref = useRef(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [uploadForm, setUploadForm] = useState(null);
  // const selectedLecturer = UserStore.lecturers.find(
  //   (lecturer) => lecturer?.idno === id
  // );

  const nameref = useRef();
  const idref = useRef();
  const emailref = useRef();
  const branchref = useRef();
  const phoneref = useRef();

  const autofillref = () => {
    try {
      nameref.current.value = selectedLecturer?.name;
      idref.current.value = selectedLecturer?.idno;
      emailref.current.value = selectedLecturer?.email;
      branchref.current.value = selectedLecturer?.department;
      phoneref.current.value = selectedLecturer?.phoneNumber;
      expiryDateref.current.value = new Date(selectedLecturer?.access?.expiresAt)
    } catch (error) { }
  };

  const goBack = () => {
    if (CommonStore.role === "principal") {
      navigate(`/principal/${branch}`);
    } else {
      navigate(`/${branch}/staffpage`);
    }
  };

  useEffect(() => {
    autofillref();
    const lecturer = UserStore.lecturers.find(
      (lecturer) => lecturer?._id === id
    );
    setSelectedLecturer(lecturer);
  }, [editForm, uploadForm]);

  const giveAccess = async (id) => {
    const dateString = expiryDateref.current.value;
    // const dateObject = new Date(dateString);
    console.log(dateString)
    const date1 = new Date(dateString);

   
    const timestamp =  date1.toISOString();

    console.log('Converted Timestamp:', timestamp);

    await AccessStore.AccessLecturers(timestamp, id);
    // const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    // const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    // const formattedDate = date.toLocaleString(undefined, options).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2');
    date1.setHours(date1.getHours() + 5);
    date1.setMinutes(date1.getMinutes() + 30);
    const timestamp1 = date1.toISOString();
    setExpiryDate(timestamp1)
    setUploadForm(false)
  }


  useEffect(() => {
    const date = new Date(selectedLecturer?.access?.expiresAt).toLocaleString('en-US', {
      timeZone: 'UTC',
    });
    // const timeStamp = selectedLecturer?.access?.expiresAt;
    // const date = new Date(timeStamp * 1000); // Convert seconds to milliseconds
    // const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    // const formattedDate = date.toLocaleString(undefined, options).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2');
    // setExpiryDate(formattedDate)
  }, [selectedLecturer])


  const uploadFilesForm = () => {
    setUploadForm(true)
    setDeleteForm(false)
    setEditForm(false)
  }

  const falseUpload = () => {
    setUploadForm(false)
  }


  const updateLecturerDetails = async (id) => {
    const name = nameref.current.value;
    const idno = idref.current.value;
    const email = emailref.current.value;
    const branch = branchref.current.value;
    const phoneNumber = phoneref.current.value;
    console.log(name, idno, email, branch);
    console.log(id);
    if (await UserStore.updateLecturers(name, idno, email, branch, phoneNumber, id)) {
      setEditForm(false);

      setUploadForm(false);
    }

  };

  const removeLecturer = async (id) => {
    await UserStore.deleteLecturers(id);
    setDeleteForm(false);
    navigate(`/principal/${branch}`);
  }

  const logout = () => {
    localStorage.removeItem("user");
    UserStore.user = null;
    UserStore.setPrincipalAuth(false);
    UserStore.setHodAuth(false);
    UserStore.setStudentAuth(false);
    navigate("/welcome");
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
      await UserStore.updateLecturerImage(imageURL, UserStore.user?._id);
      setLoading(false);
    } catch (error) {

    }
  };



  const changeImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImageToFirebase(file);
    }
  };



  return useObserver(() => (
    <div className="w-[100%] flex flex-col items-center py-4 h-full rounded-b-2xl bg-secondary">
      {loading &&
        <Loader loader={true} />
      }
      <div className="w-[90%] my-2 mx-auto flex items-center justify-between">
        <button className="flex items-center  text-lg" onClick={goBack}>
          <AiOutlineLeft className="mr-1" /> Back
        </button>

        {CommonStore.role === "principal" ? (
          <div className="w-[35%] flex justify-between items-center gap-2">
            <button
              onClick={uploadFilesForm}
              className="w-10 h-10 bg-primary rounded-full  text-2xl text-white flex items-center justify-center">
              <MdOutlineAddToHomeScreen />
            </button>
            <button
              onClick={() => {
                setEditForm(true)
                setDeleteForm(false)
                setUploadForm(false)
              }}
              className="w-10 h-10 bg-primary rounded-full text-2xl text-white flex items-center justify-center"
            >
              {" "}
              <MdOutlineEdit />
            </button>
            <button
              onClick={() => {
                setEditForm(false)
                setDeleteForm(true)
                setUploadForm(false)
              }}
              className="w-10 h-10 bg-primary rounded-full text-2xl text-white flex items-center justify-center"
            >
              {" "}
              <MdDeleteOutline />
            </button>
          </div>
        ) : (
          <div onClick={logout} className="flex items-center gap-2">
            <p className="text-red-600">
              Logout
            </p>
            <div

              className="bg-primary cursor-pointer rounded-full text-white text-2xl h-10 w-10 flex items-center justify-center"
            >
              <BiLogOut className="mr-1" />
            </div>
          </div>
        )}
      </div>
      {CommonStore.role === "hod" && !UserStore.user?.photo || CommonStore.role === "staff" && !UserStore.user?.photo ? (
        <div onClick={openFiles} className="bg-primary text-white my-6 w-48 h-52 rounded-lg flex flex-col items-center justify-center">
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
      ) : (
        <div className="w-48 h-52 rounded-lg relative overflow-hidden"
          style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
        >
          <img
            src={CommonStore.role === "hod" || CommonStore.role === "staff" ? UserStore.user?.photo : selectedLecturer?.photo}
            className="w-full h-full rounded-lg object-cover"
            alt=""
          />
          {CommonStore.role === UserStore.user?.role && <span onClick={openFiles} className="bg-primary w-6 absolute z-auto cursor-pointer right-0 bottom-0 h-6 rounded-full flex items-center justify-center">
            <MdOutlineEdit className=" text-white" />
            <input type="file" id="fileinput" className="hidden" ref={fileInputRef} onChange={changeImage} />
          </span>}
        </div>
      )}

      <div className="flex flex-col w-[90%]">
        <div className="flex flex-col mt-2 items-start ">
          <label className="pb-2">Name</label>
          <div className="text-base px-4 py-2 w-full  border-2 rounded-lg border-black">
            {CommonStore.role === "hod" || CommonStore.role === "staff" ? UserStore.user?.name : selectedLecturer?.name}
          </div>
        </div>
        <div className="flex flex-col mt-2 items-start ">
          <label className="pb-2">I'd number</label>
          <div className="text-base px-4 py-2 w-full  border-2 rounded-lg border-black">
            {CommonStore.role === "hod" || CommonStore.role === "staff" ? UserStore.user?.idno : selectedLecturer?.idno}
          </div>
        </div>
        <div className="flex flex-col mt-2 items-start ">
          <label className="pb-2">Branch name</label>
          <div className="text-base px-4 py-2 w-full  border-2 rounded-lg border-black">
            {CommonStore.role === "hod" || CommonStore.role === "staff" ? UserStore.user?.department : selectedLecturer?.department}
          </div>
        </div>
        <div className="flex flex-col mt-2 items-start ">
          <label className="pb-2">Phone number</label>
          <div className="text-base px-4 py-2 w-full  border-2 rounded-lg border-black">
            {CommonStore.role === "hod" || CommonStore.role === "staff" ? UserStore.user?.phoneNumber : selectedLecturer?.phoneNumber}
          </div>
        </div>
        <div className="flex flex-col mt-2 items-start ">
          <label className="pb-2">Email address</label>
          <div className="text-base px-4 py-2 w-full  border-2 rounded-lg border-black">
            {CommonStore.role === "hod" || CommonStore.role === "staff" ? UserStore.user?.email : selectedLecturer?.email}
          </div>
        </div>
        {CommonStore.role === "principal" && (

          <p>Access granted till {expiryDate}</p>
        )}
      </div>

      {editForm && !uploadForm && !deleteForm ? (
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
              <label className="pb-2 text-white">I'd Number</label>
              <input
                required
                ref={idref}
                type="text"
                className="bg-primary mb-1 px-1 text-white text-lg text-opacity-80 focus:outline-none border-b-2 border-[rgba(255, 255, 255, 1)]"
              />
            </div>
            <div className="flex flex-col mt-1">
              <label className="pb-2 text-white">E-mail</label>
              <input
                required
                ref={emailref}
                type="email"
                className="bg-primary mb-1 px-1 text-white text-lg text-opacity-80 focus:outline-none border-b-2 border-[rgba(255, 255, 255, 1)]"
              />
            </div>
            <div className="flex flex-col mt-1">
              <label className="pb-2 text-white">phone number</label>
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
              onClick={() => updateLecturerDetails(selectedLecturer?._id)}
              className="absolute right-6 bottom-4 px-8 py-1 bg-black text-white rounded-lg text-base"
            >
              Save
            </button>
          </div>
        </div>
      ) : null}

      {deleteForm && !editForm && !uploadForm ? (
        <div className="fixed inset-0  w-[80%] m-auto h-[20%] flex flex-col z-50 py-4 px-2 rounded-2xl items-center  bg-primary">
          <h1 className="text-center text-2xl text-white">Confirm to delete</h1>
          <p className="text-white pt-1 text-2xl">
            {selectedLecturer?.name}
          </p>
          {/* <AiOutlineClose onClick={() => setDeleteForm(false)} className="absolute text-white text-2xl cursor-pointer right-2 top-4" /> */}
          <div className="w-[90%] mx-auto flex my-3  justify-between items-center">
            <button
              onClick={() => setDeleteForm(false)}
              className="flex w-[40%] mx-auto text-xl justify-between bg-black rounded-lg  text-white items-center p-2"
            >
              Cancel
              <AiOutlineClose className="mx-1" />
            </button>
            <button onClick={() => removeLecturer(selectedLecturer?._id)} className="flex w-[40%] mx-auto text-xl justify-between bg-black rounded-lg text-white items-center p-2">
              Delete
              <MdDeleteOutline className="mx-1" />
            </button>
          </div>
        </div>
      ) : null}
      {
        uploadForm && !editForm && !deleteForm ? (
          <div className="fixed bg-primary text-white inset-0 w-[90%] m-auto h-[25%] flex flex-col z-50 py-4 px-2 shadow-2xl rounded-2xl  ">
            <div className="w-[90%] h-full mx-auto flex flex-col items-center">
              <h1 className="text-xl">Give Access</h1>
              <input ref={expiryDateref} type="datetime-local" className="text-base px-4 py-2 mt-4 text-black  border-2 rounded-lg border-white" />
              <p className="text-xs mt-6">By giving access the user can upload the certificates</p>
              <div className="flex mt-1 w-[60%] justify-between">
                <button onClick={() => giveAccess(selectedLecturer?._id)} className="text-justify hover:bg-white border border-white hover:text-black py-1  px-6 rounded">Yes</button>
                <button onClick={falseUpload} className="text-justify py-1 hover:bg-white border border-white hover:text-black  px-6 rounded">No</button>
              </div>
            </div>
          </div>
        ) : null
      }
    </div>
  ));
}
