import { MdArrowBackIosNew } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useStores } from "../store/index";
import { useObserver } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";

export const Profile = () => {
  const navigate = useNavigate();
  const { UserStore, CommonStore } = useStores();
  const [imageUrl, setImageUrl] = useState();
  const fileInputRef = useRef(null);
  const nameRef = useRef(null);
  const mobileRef = useRef(null);
  const mailRef = useRef(null);
  const collegeNameRef = useRef(null);
  const collegeCodeRef = useRef(null);
  const collegeAddressRef = useRef(null);
  const [editable, setEditable] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const defaultprofile = "https://ih1.redbubble.net/image.1046392278.3346/pp,504x498-pad,600x600,f8f8f8.jpg"
  const goToHomepage = () => {
    if (CommonStore.role === "principal") {
      navigate("/principal");
    } else if (CommonStore.role === "hod" || CommonStore.role === "staff") {
      navigate(`/${UserStore.user?.department.toUpperCase()}/staffpage`);
    } else {
      navigate(`/${UserStore.user?.department}/${UserStore.user?._id}`);
    }
  };

  useEffect(() => {
    autofillRef();
  }, []);

  const autofillRef = () => {
    if (CommonStore.role === "principal") {
      nameRef.current.value = UserStore.user?.name;
      mobileRef.current.value = UserStore.user?.phoneNumber;
      mailRef.current.value = UserStore.user?.email;
      collegeNameRef.current.value = UserStore.user?.college;
      collegeCodeRef.current.value = UserStore.user?.collegeCode;
      collegeAddressRef.current.value = UserStore.user?.collegeAddress;
    } else {
      nameRef.current.value = UserStore.principal[0]?.name;
      mobileRef.current.value = UserStore.principal[0]?.phoneNumber;
      mailRef.current.value = UserStore.principal[0]?.email;
      collegeNameRef.current.value = UserStore.principal[0]?.college;
      collegeCodeRef.current.value = UserStore.principal[0]?.collegeCode;
      collegeAddressRef.current.value = UserStore.principal[0]?.collegeAddress;
    }
  }

  const uploadImageToFirebase = async (file) => {

    const timeStamp = new Date().valueOf();
    const storageRef = ref(storage, `images/${timeStamp}-${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      console.log('Image uploaded to Firebase Storage');
      const imageURL = await getDownloadURL(storageRef);

      setImageUrl(imageURL);
      console.log(imageURL);

      if (CommonStore.role === "principal") {
        await UserStore.updateImageofPrincipal(UserStore.user?._id, imageURL);
      }
      else if (CommonStore.role === "hod" || CommonStore.role === "staff") {
        await UserStore.updateLecturerPhoto(imageURL, UserStore.user?._id);
      }

    } catch (error) {

    }

  };

  const changeImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImageToFirebase(file);
    }
  }


  const openfiles = () => {
    fileInputRef.current.click();
  }

  const updatePrincipal = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const mobile = mobileRef.current.value;
    const mail = mailRef.current.value;
    const collegeName = collegeNameRef.current.value;
    const collegeCode = collegeCodeRef.current.value;
    const collegeAddress = collegeAddressRef.current.value;
    const image = UserStore.user?.photo;
    const coverImage = UserStore.user?.coverImage;
    const id = UserStore.user?._id;
    if (mobile.length !== 10) {
      return alert("Enter valid number")
    }
    UserStore.updatePrincipal(name, mobile, image, coverImage, mail, collegeName, collegeCode, collegeAddress, id);
    setEditable(false);
  }

  const logout = () => {
    UserStore.setUser(null);
    localStorage.clear();
    UserStore.setPrincipalAuth(false);
    UserStore.setHodAuth(false);
    UserStore.setStudentAuth(false);
    CommonStore.setRole(null);
    navigate("/welcome");
  };

  return useObserver(() => (
    <div className=" h-screen">
      <div className="flex pt-4 pb-4 justify-between">
        <div onClick={goToHomepage} className="flex">
          <MdArrowBackIosNew className="mt-1 mx-2" />
          <p> Back</p>
        </div>
        {CommonStore.role === "principal" && (
          <div onClick={logout} className="flex items-center gap-2">
            <p className="text-red-600">Logout</p>
            <div

              className="bg-primary cursor-pointer rounded-full text-white text-2xl h-8 w-8 mr-4"
            >
              <BiLogOut className="mt-1 mx-1" />
            </div>
          </div>
        )}
      </div>
      <img
        className="w-[100%] object-cover h-60"
        src={CommonStore.role === "principal" ? UserStore.user?.coverImage : UserStore.principal[0]?.coverImage}
        alt=""
      />
      <div className="flex flex-col w-full rounded-2xl absolute bg-white z-40 mt-[-10%]  items-start">
        <div className="w-full flex justify-between">
          <div className="w-24 h-24  rounded-full border border-white mt-[-12%] mx-5  overflow-hidden"
            style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
          >
            <img
              className="rounded-full object-cover "
              src={CommonStore.role === "principal" ? UserStore.user?.photo : UserStore.principal[0]?.photo}
              alt=" "
            />
          </div>
          {CommonStore.role === "principal" && (
            <>
              <span onClick={openfiles} className="bg-blue-900 w-5 h-5 absolute left-[24%] top-[4%] rounded-full flex items-center justify-center">
                <MdOutlineEdit className=" text-white" />
                <input type="file" id="fileinput" className="hidden" ref={fileInputRef} onChange={changeImage} />
              </span>
              <button onClick={() => setShowPopup(true)} className="flex items-center mx-4">Edit Details <MdOutlineEdit className="text-primary ml-1" /></button>
            </>
          )}

        </div>
        <form onSubmit={updatePrincipal} className="flex flex-col items-center w-[85%] mx-auto ">
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Principal Name</label>
            <input ref={nameRef} disabled={!editable} type="text" className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Mobile Number</label>
            <input ref={mobileRef} disabled={!editable} type="text" className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Mail-ID</label>
            <input ref={mailRef} disabled={!editable} type="email" className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">College Name</label>
            <input ref={collegeNameRef} disabled={!editable} type="text" className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">College Code</label>
            <input ref={collegeCodeRef} disabled={!editable} type="text" className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">College Address</label>
            <textarea ref={collegeAddressRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          {editable && (
            <button type="submit" className="bg-primary w-full py-2  my-3 rounded-lg text-white ">Save</button>
          )
          }
        </form>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center">
          <div className="bg-white w-[80%] h-auto rounded-lg shade-sh flex flex-col items-center justify-center py-8">
            <p className="text-2xl text-center font-semibold">Edit Details</p>
            <div className="flex mt-6 w-[60%] justify-between">
              <button onClick={() => { setEditable(true); setShowPopup(false) }} className="text-justify hover:bg-primary border border-primary hover:text-white py-1  px-4 rounded-lg">Yes</button>
              <button onClick={() => { setEditable(false); setShowPopup(false) }} className="text-justify py-1 hover:bg-primary border border-primary hover:text-white  px-4 rounded-lg">No</button>
            </div>
          </div>
        </div>
      )}

    </div>
  ));
};
