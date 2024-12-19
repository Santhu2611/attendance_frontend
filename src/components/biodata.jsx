import { MdOutlineEdit } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { useStores } from "../store/index";
import { useObserver } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { set, toJS } from "mobx";
import Loader from "./reusable_Components/loader"

export default function Biodata() {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false)
  const { id, branch } = useParams();
  const navigate = useNavigate();
  const { UserStore, CommonStore } = useStores();
  const [imageUrl, setImageUrl] = useState();
  const fileInputRef = useRef(null);
  const nameRef = useRef(null);
  const pinRef = useRef(null);
  const fathernameRef = useRef(null);
  const mothernameRef = useRef(null);
  const parentnumberRef = useRef(null);
  const birthRef = useRef(null);
  const polycetRef = useRef(null);
  const rationRef = useRef(null);
  const genderRef = useRef(null);
  const studentaadharRef = useRef(null);
  const fatheraadharRef = useRef(null);
  const motheraadharRef = useRef(null);
  const studentnumberRef = useRef(null);
  const categoryRef = useRef(null);
  const religionRef = useRef(null);
  const studiedRef = useRef(null);
  const polycetrankRef = useRef(null);
  const joiningRef = useRef(null);
  const physicalRef = useRef(null);
  const emailRef = useRef(null);
  const addressRef = useRef(null);
  const districtRef = useRef(null);
  const pincodeRef = useRef(null);
  const moleRef = useRef(null);
  const photoRef = useRef(null);
  const roleRef = useRef(null);
  const documentsRef = useRef([]);
  const isVerifiedRef = useRef(null);
  const yearRef = useRef(null);
  const departmentRef = useRef(null);
  const sschallticketRef = useRef(null);
  const [editable, setEditable] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const defaultprofile = "https://ih1.redbubble.net/image.1046392278.3346/pp,504x498-pad,600x600,f8f8f8.jpg"
  const goToHomepage = () => {
    if (CommonStore.role === "principal") {
      navigate(`/${branch}/${id}`);
    } else if (CommonStore.role === "hod" || CommonStore.role === "staff") {
      navigate(`/${UserStore.user?.department.toUpperCase()}/staffpage`);
    } else {
      navigate(`/${UserStore.user?.department}/${UserStore.user?._id}`);
    }
  };

  const user = () => {
    try {

      return UserStore.students.find((student) => student?._id === id);
    } catch (error) {

    }
  }


  const selectedStudent = user();

  useEffect(() => {

    autofillRef();
  }, []);

  const autofillRef = () => {
    if (CommonStore.role === "student") {
      try {
        pinRef.current.value = UserStore?.user?.pinno;
        nameRef.current.value = UserStore?.user?.name;
        yearRef.current.value = UserStore?.user?.semister;
        fathernameRef.current.value = UserStore?.user?.fathername;
        mothernameRef.current.value = UserStore?.user?.mothername;
        parentnumberRef.current.value = UserStore?.user?.parentmobile;
        birthRef.current.value = UserStore?.user?.dateofbirth;
        polycetRef.current.value = UserStore?.user?.polycethtno;
        rationRef.current.value = UserStore?.user?.rationcardno;
        genderRef.current.value = UserStore?.user?.gender;
        studentaadharRef.current.value = UserStore?.user?.studentaadharno;
        fatheraadharRef.current.value = UserStore?.user?.fatheraadharno;
        motheraadharRef.current.value = UserStore?.user?.motheraadharno;
        studentnumberRef.current.value = UserStore?.user?.studentmobile;
        categoryRef.current.value = UserStore?.user?.category;
        religionRef.current.value = UserStore?.user?.religion;
        studiedRef.current.value = UserStore?.user?.resides;
        polycetrankRef.current.value = UserStore?.user?.polycetrank;
        joiningRef.current.value = UserStore?.user?.dateofjoining;
        physicalRef.current.value = UserStore?.user?.physicallychallenged;
        emailRef.current.value = UserStore?.user?.emailid;
        addressRef.current.value = UserStore?.user?.address;
        districtRef.current.value = UserStore?.user?.district;
        pincodeRef.current.value = UserStore?.user?.pincode;
        emailRef.current.value = UserStore?.user?.emailid;
        moleRef.current.value = UserStore?.user?.moles;
        photoRef.current.value = UserStore?.user?.photo;
        roleRef.current.value = UserStore?.user?.role;
        // documentsRef.current.value = UserStore?.user?.documents;
        // isVerifiedRef.current.value = UserStore?.user?.isVerified;
        departmentRef.current.value = UserStore?.user?.department;
        sschallticketRef.current.value = UserStore?.user?.sschallticket;
      } catch (error) {
        console.log(error);
      }
    }
    else if (selectedStudent) {
      try {
        pinRef.current.value = selectedStudent?.pinno;
        nameRef.current.value = selectedStudent?.name;
        yearRef.current.value = selectedStudent?.semister;
        fathernameRef.current.value = selectedStudent?.fathername;
        mothernameRef.current.value = selectedStudent?.mothername;
        parentnumberRef.current.value = selectedStudent?.parentmobile;
        birthRef.current.value = selectedStudent?.dateofbirth;
        polycetRef.current.value = selectedStudent?.polycethtno;
        rationRef.current.value = selectedStudent?.rationcardno;
        genderRef.current.value = selectedStudent?.gender;
        studentaadharRef.current.value = selectedStudent?.studentaadharno;
        fatheraadharRef.current.value = selectedStudent?.fatheraadharno;
        motheraadharRef.current.value = selectedStudent?.motheraadharno;
        studentnumberRef.current.value = selectedStudent?.studentmobile;
        categoryRef.current.value = selectedStudent?.category;
        religionRef.current.value = selectedStudent?.religion;
        studiedRef.current.value = selectedStudent?.resides;
        polycetrankRef.current.value = selectedStudent?.polycetrank;
        joiningRef.current.value = selectedStudent?.dateofjoining;
        physicalRef.current.value = selectedStudent?.physicallychallenged;
        emailRef.current.value = selectedStudent?.emailid;
        addressRef.current.value = selectedStudent?.address;
        districtRef.current.value = selectedStudent?.district;
        pincodeRef.current.value = selectedStudent?.pincode;
        physicalRef.current.value = selectedStudent?.physicallychallenged;
        emailRef.current.value = selectedStudent?.emailid;
        moleRef.current.value = selectedStudent?.moles;
        photoRef.current.value = selectedStudent?.photo;
        roleRef.current.value = selectedStudent?.role;
        // documentsRef.current.value = selectedStudent?.documents;
        // isVerifiedRef.current.value = selectedStudent?.isVerified;
        departmentRef.current.value = selectedStudent?.department;
        sschallticketRef.current.value = selectedStudent?.sschallticket;
      } catch (error) {
        console.log(error);
      }
    }
  }

  const uploadImageToFirebase = async (file) => {

    const timeStamp = new Date().valueOf();
    const storageRef = ref(storage, `images/${timeStamp}-${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      setLoading(true);
      console.log('Image uploaded to Firebase Storage');
      const imageURL = await getDownloadURL(storageRef);

      setImageUrl(imageURL);
      console.log(imageURL);

      await UserStore.updateStudentImage(imageURL, id);
      console.log("Image URL updated in database");
      setLoading(false);

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
    if (editable) {
      fileInputRef.current.click();
    }
    else {
      alert("Please click on edit details to edit details")
    }
  }

  const check = (e, ref) => {
    console.log(ref.current)
    console.log(!editable)
    if (ref.current && ref.current.disabled && !editable) {
      alert(`Input ${ref.current.name} is disabled. Please click on edit details to edit details`)
    }
  }

  const updateBioData = async () => {
    const image = selectedStudent?.photo;
    const name = nameRef.current.value;
    const pinno = pinRef.current.value;
    const fathername = fathernameRef.current.value;
    const mothername = mothernameRef.current.value;
    const parentmobile = parentnumberRef.current.value;
    const dateofbirth = birthRef.current.value;
    const polycethtno = polycetRef.current.value;
    const rationcardno = rationRef.current.value;
    const gender = genderRef.current.value;
    const studentaadharno = studentaadharRef.current.value;
    const fatheraadharno = fatheraadharRef.current.value;
    const motheraadharno = motheraadharRef.current.value;
    const studentmobile = studentnumberRef.current.value;
    const category = categoryRef.current.value;
    const religion = religionRef.current.value;
    const resides = studiedRef.current.value;
    const polycetrank = polycetrankRef.current.value;
    const dateofjoining = joiningRef.current.value;
    const physicallychallenged = physicalRef.current.value === "Yes" ? true : false;
    const emailid = emailRef.current.value;
    const address = addressRef.current.value;
    const district = districtRef.current.value;
    const year = yearRef.current.value;
    const pincode = pincodeRef.current.value;
    const id = selectedStudent?._id;
    setLoading(true)
    await UserStore.updateStudentBiodata(image, name, pinno, fathername, mothername, parentmobile, dateofbirth, polycethtno,
      rationcardno, gender, studentaadharno, fatheraadharno, motheraadharno, studentmobile, category, religion, resides, polycetrank, dateofjoining, physicallychallenged, emailid, address, district, pincode, id, year);
    setEditable(false);
    setLoading(false)
  }

  const editAccess = () => {
    if (UserStore.user?.access?.granted) {
      setEditable(true)
      setShowPopup(false)
    }
    else {
      setShowPopup(false)
      setShowError(true)
    }
  }


  return useObserver(() => (
    <div className=" h-screen">
      {
        loading && <Loader loader={true} />
      }
      <div className="flex pt-4 pb-4 justify-between bg-primary">
        <div onClick={goToHomepage} className="flex">
          <div className="bg-primary h-48 ">
            <button className="flex items-center w-[20%] mx-4 text-xl text-white">
              <BiArrowBack className="text-white text-2xl mt-5" />
            </button>
            <h1 className="text-white text-4xl ml-[100%]"> Biodata </h1>
          </div>
        </div>

      </div>

      <div className="flex flex-col w-full rounded-2xl absolute bg-white z-40 mt-[-10%]  items-start">
        <div className="w-full flex justify-between">
          <div className="relative h-fit w-fit mt-[-30px]">
            <div className="w-24 h-24  rounded-full border-4 border-white mt-[-12%] mx-5   overflow-hidden"
              style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
            >
              <img
                className="rounded-full object-cover "
                src={CommonStore.role === "student" ? UserStore.user?.photo : selectedStudent?.photo}
                alt=" "
              />
            </div>
            <span onClick={openfiles} className=" text-white flex justify-center items-center absolute bottom-1 p-[2px] right-6 border-4 border-white bg-primary h-8 w-8  rounded-full">
              <MdOutlineEdit />
              <input type="file" id="fileinput" className="hidden" ref={fileInputRef} onChange={changeImage} />
            </span>
          </div>

          {
            (CommonStore.role === "hod" || CommonStore.role === "staff") && (
              <button onClick={() => setShowPopup(true)} className="flex items-center mx-4">Edit Details <MdOutlineEdit className="text-primary ml-1" /></button>
            )
          }



        </div>
        {showError && <p className="text-red-500 font-semibold w-[90%] mx-auto mt-2">! You don't have access to edit the details</p>}

        <div className="flex flex-col items-center w-[85%] mx-auto ">
          <div
            onClick={(e) => check(e, nameRef)} className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Student Name</label>
            <input ref={nameRef} disabled={!editable}
              type="text" className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Pin Number</label>
            <input ref={pinRef} disabled={!editable} type="text" className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Year</label>
            <select ref={yearRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" >
              <option value="1st Year">1</option>
              <option value="2nd Year">2</option>
              <option value="3nd Year">3</option>
            </select>
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Father's Name</label>
            <input ref={fathernameRef} disabled={!editable} type="email" className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Mother's Name</label>
            <input ref={mothernameRef} disabled={!editable} type="text" className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Parent Mobile Number</label>
            <input ref={parentnumberRef} disabled={!editable} type="text" className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Date Of Birth</label>
            <input ref={birthRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">POLYCET HT Number</label>
            <input ref={polycetRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Ration Card Number</label>
            <input ref={rationRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Gender</label>
            <input ref={genderRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Student AADHAR Number</label>
            <input ref={studentaadharRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Father AADHAR Number</label>
            <input ref={fatheraadharRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Mother AADHAR Number</label>
            <input ref={motheraadharRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Student Mobile Number</label>
            <input ref={studentnumberRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Category (Sub Caste) </label>
            <input ref={categoryRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Religion</label>
            <input ref={religionRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Studied/Resided during SSC</label>
            <input ref={studiedRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">POLYCET Rank</label>
            <input ref={polycetrankRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Date of Joining</label>
            <input ref={joiningRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Physically Challenged</label>
            <select ref={physicalRef} disabled={!editable} placeholder="Select yes or no" className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Email-id</label>
            <input ref={emailRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">Address</label>
            <input ref={addressRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">District</label>
            <input ref={districtRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          <div className="flex flex-col mt-2 w-full items-start">
            <label className="text-secondary2">PIN Code</label>
            <input ref={pincodeRef} disabled={!editable} className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
          </div>
          {editable && (
            <button
              onClick={updateBioData}
              className="bg-primary w-full py-2  my-3 rounded-lg text-white ">Save</button>
          )
          }
        </div>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center">
          <div className="bg-white w-[80%] h-auto rounded-lg shade-sh flex flex-col items-center justify-center py-8">
            <p className="text-2xl text-center font-semibold">Edit Details</p>
            <div className="flex mt-6 w-[60%] justify-between">
              <button onClick={editAccess} className="text-justify hover:bg-primary border border-primary hover:text-white py-1  px-4 rounded-lg">Yes</button>
              <button onClick={() => { setEditable(false); setShowPopup(false) }} className="text-justify py-1 hover:bg-primary border border-primary hover:text-white  px-4 rounded-lg">No</button>
            </div>
          </div>
        </div>
      )}

    </div >
  ));
};
