import { useRef, useState } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useStores } from "../store/index";
import { useObserver } from "mobx-react";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { MdOutlineEdit } from "react-icons/md";

export default function NewStaff({ onstaff }) {
  const { branch } = useParams();
  const navigate = useNavigate();
  const { UserStore } = useStores();
  const showBranch = () => {
    if (onstaff) {
      return navigate(`/${branch}/staffpage`);
    }
    return navigate(`/principal/${branch}`);
  };
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const nameref = useRef();
  const idref = useRef();
  const emailref = useRef();
  const branchref = useRef();
  const passwordref = useRef();
  const roleref = useRef();
  const phnoref = useRef();
  const fileInputRef = useRef();
  const yearref = useRef(null);

  const postDetails = async (e) => {
    e.preventDefault();
    try {
      const name = nameref.current.value;
      const id = idref.current.value;
      const email = emailref.current.value;
      const branch = branchref.current.value;
      const password = passwordref.current.value;
      const role = roleref.current.value;
      const phone = phnoref.current.value;
      if (phone.length !== 10) {
        return alert("Enter valid mobile number");
      }
      await UserStore.postLecturers(
        name,
        id,
        email,
        branch,
        password,
        role,
        phone
      );
      navigate(`/principal/${branch}`);
      // const data = {
      //     name,
      //     id,
      //     email,
      //     branch
      // }
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const autoGeneratePassword = () => {
    const password = Math.random().toString(36).slice(-8);
    passwordref.current.value = password;
  };

  const openFiles = () => {
    fileInputRef.current.click();
  }

  const changeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImageToFirebase(file);
      setShowImage(true);
    }
  }

  const uploadImageToFirebase = async (file) => {
    const timeStamp = new Date().valueOf();
    const storageRef = ref(storage, `images/${timeStamp}-${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      console.log("Uploaded");
      const imageUrl = await getDownloadURL(storageRef);
      console.log(imageUrl);
      setImageUrl(imageUrl);
    }
    catch (error) {
      console.log(error);
    }
  }

  const postStudentDetails = async (e) => {
    e.preventDefault();
    try {
      if (!showImage) {
        alert("Please upload an image");
        return;
      }
      const name = nameref.current.value;
      const id = idref.current.value;
      const email = emailref.current.value;
      const branch = branchref.current.value;
      const password = passwordref.current.value;
      const phone = phnoref.current.value;
      const year = yearref.current.value;
      const image = imageUrl;
      if (phone.length !== 10) {
        return alert("Enter valid mobile number")
      }
      await UserStore.postStudents(image, name, id, email, phone, branch, password, year);
      navigate(`/${branch}/staffpage`);
    }
    catch (error) {
      console.log(error);
    }
  }

  return useObserver(() => (

    <>
      {
        onstaff ? (
          <>
            <div className="flex flex-col w-[100%] py-8  bg-secondary rounded-tr-[100px] ">
              <button
                className="flex items-center w-[20%] mx-4  text-lg"
                onClick={showBranch}
              >
                <AiOutlineLeft className="mr-1" /> Back
              </button>

              <form
                onSubmit={postStudentDetails}
                className="flex flex-col w-[90%] mx-auto h-full"
              >
                {
                  showImage ? (
                    <div className="relative w-[30%] mx-auto h-[15vh]">
                      <img src={imageUrl} className="w-full h-full rounded-lg" alt="" />
                      <span onClick={openFiles} className="bg-primary cursor-pointer w-5 absolute z-50 -right-1 -top-1 h-5 rounded-full flex items-center justify-center">
                        <MdOutlineEdit className=" text-white" />
                        <input type="file" id="fileinput" className="hidden" ref={fileInputRef} onChange={changeImage} />
                      </span>
                    </div>
                  ) : (
                    <div onClick={openFiles} className="flex text-white flex-col items-center justify-center w-[30%] mx-auto h-[15vh] rounded-lg bg-primary">
                      <IoMdAdd className="text-2xl" />
                      <p className="text-xs">Upload Image</p>
                      <input type="file" name="image upload" ref={fileInputRef} onChange={changeImage} className="hidden" />
                    </div>
                  )
                }
                <div className="flex flex-col mt-2">
                  <label className="pb-2 font-semibold">Name</label>
                  <input
                    required
                    ref={nameref}
                    type="text"
                    className="bg-secondary my-1 px-1  text-opacity-80 text-xl focus:outline-none border-b-2 border-black"
                  />
                </div>
                <div className="flex flex-col mt-1">
                  <label className="pb-2 ">Pin Number</label>
                  <input
                    required
                    ref={idref}
                    type="text"
                    className="bg-secondary my-1 px-1  text-lg text-opacity-80 focus:outline-none border-b-2 border-black"
                  />
                </div>
                <div className="flex flex-col mt-1">
                  <label className="pb-2 ">E-mail</label>
                  <input
                    required
                    ref={emailref}
                    type="email"
                    className="bg-secondary my-1 px-1 text-lg text-opacity-80 focus:outline-none border-b-2 border-black"
                  />
                </div>

                <div className="flex flex-col mt-1">
                  <label className="pb-2 ">Phone Number</label>
                  <input
                    required
                    ref={phnoref}
                    type="text"
                    className="bg-secondary my-1 px-1 text-lg text-opacity-80 focus:outline-none border-b-2 border-black"
                  />
                </div>



                <div className="flex flex-col mt-1">
                  <label className="pb-2 ">Branch</label>
                  <select
                    required
                    ref={branchref}
                    type="text"
                    className=" my-1  px-1 w-[65%] rounded-lg text-opacity-80  text-lg focus:outline-none  "
                  >
                    <option className="text-xs bg-white" value="Mech">
                      Mechanical Engineering
                    </option>
                    <option className="text-xs bg-white" value="EEE">
                      Electrical Engineering
                    </option>
                    <option className="text-xs bg-white" value="ECE">
                      Electronics Engineering
                    </option>
                    <option className="text-xs" value="Civil">
                      Civil Engineering
                    </option>
                  </select>
                </div>

                <div className="flex flex-col mt-1">
                  <label className="pb-1 ">Year</label>
                  <select
                    required
                    ref={yearref}
                    type="text"
                    className="bg-secondary my-1 px-1 text-lg text-opacity-80 focus:outline-none border-b-2 border-black"
                  >
                    <option value="1st Year">1</option>
                    <option value="2nd Year">2</option>
                    <option value="3rd Year">3</option>
                  </select>
                </div>

                <div className="flex flex-col mt-1">
                  <div className="flex justify-between">
                    <label className="pb-2 ">Password</label>
                    <button type="button" onClick={autoGeneratePassword} className="pt-2 flex items-center"><RiLockPasswordLine className="mr-1" /> auto generate</button>
                  </div>
                  <input
                    required
                    ref={passwordref}
                    type="text"
                    className="bg-secondary my-1 px-1 text-lg text-opacity-80 focus:outline-none border-b-2 border-black"
                  />
                </div>

                <div className="w-full flex justify-end">
                  <button
                    type="submit"
                    className="w-[30%] px-8 mt-10 mx-1 py-1 bg-primary text-white rounded-lg text-base"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col w-[100%] py-8  bg-secondary rounded-tr-[100px] ">
              <button
                className="flex items-center w-[20%] mx-4  text-lg"
                onClick={showBranch}
              >
                <AiOutlineLeft className="mr-1" /> Back
              </button>
              <h1 className="text-center text-2xl font-semibold mt-[3%]">
                Enter Details{" "}
              </h1>

              <form
                onSubmit={postDetails}
                className="flex flex-col w-[90%] mx-auto h-full"
              >
                <div className="flex flex-col mt-2">
                  <label className="pb-2 font-semibold">Name</label>
                  <input
                    required
                    ref={nameref}
                    type="text"
                    className="bg-secondary my-1 px-1  text-opacity-80 text-xl focus:outline-none border-b-2 border-black"
                  />
                </div>
                <div className="flex flex-col mt-1">
                  <label className="pb-2 ">I'd Number</label>
                  <input
                    ref={idref}
                    type="text"
                    className="bg-secondary my-1 px-1  text-lg text-opacity-80 focus:outline-none border-b-2 border-black"
                  />
                </div>
                <div className="flex flex-col mt-1">
                  <label className="pb-2 ">E-mail</label>
                  <input
                    required
                    ref={emailref}
                    type="email"
                    className="bg-secondary my-1 px-1 text-lg text-opacity-80 focus:outline-none border-b-2 border-black"
                  />
                </div>

                <div className="flex flex-col mt-1">
                  <label className="pb-2 ">Phone Number</label>
                  <input
                    required
                    ref={phnoref}
                    type="text"
                    className="bg-secondary my-1 px-1 text-lg text-opacity-80 focus:outline-none border-b-2 border-black"
                  />
                </div>

                <div className="flex flex-col mt-1">
                  <div className="flex justify-between">
                    <label className="pb-2 ">Password</label>
                    <button type="button" onClick={autoGeneratePassword} className="pt-2 flex items-center"><RiLockPasswordLine className="mr-1" /> auto generate</button>
                  </div>
                  <input
                    required
                    ref={passwordref}
                    type="text"
                    className="bg-secondary my-1 px-1 text-lg text-opacity-80 focus:outline-none border-b-2 border-black"
                  />
                </div>

                <div className="flex flex-col mt-1">
                  <label className="pb-2 ">Branch</label>
                  <select
                    required
                    ref={branchref}
                    type="text"
                    className=" my-1  px-1 bg-secondary border-b-2 border-black text-opacity-80  text-lg focus:outline-none  "
                  >
                    <option className="text-xs bg-white" value="Mech">
                      Mechanical Engineering
                    </option>
                    <option className="text-xs bg-white" value="EEE">
                      Electrical Engineering
                    </option>
                    <option className="text-xs bg-white" value="ECE">
                      Electronics Engineering
                    </option>
                    <option className="text-xs" value="Civil">
                      Civil Engineering
                    </option>
                  </select>
                </div>

                <div className="flex flex-col mt-1">
                  <label className="pb-2 ">Role</label>
                  <select
                    required
                    ref={roleref}
                    type="text"
                    className=" my-1  px-1 bg-secondary border-b-2 border-black text-opacity-80  text-lg focus:outline-none  "
                  >
                    <option className="text-xs bg-white" value="hod">
                      Head of Department
                    </option>
                    <option className="text-xs bg-white" value="staff">
                      staff
                    </option>
                  </select>
                </div>

                <div className="w-full flex justify-end">
                  <button
                    type="submit"
                    className="w-[30%] px-8 mt-10 mx-1 py-1 bg-primary text-white rounded-lg text-base"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </>
        )
      }
    </>
  ));
}
