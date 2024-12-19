import { useRef, useState } from "react";
import logo from "../assets/logo.jpeg";
import { MdOutlineEdit } from "react-icons/md";
import { useStores } from "../store";
import { useNavigate } from "react-router-dom";
import Loader from "./reusable_Components/loader";

export default function OtpVerification(){
    const [isOtpSent, setIsOtpSent] = useState(false);
    const emailRef = useRef(null);
    const [email,setEmail] = useState(null);
    const {VerificationStore,CommonStore,UserStore} = useStores();
    const [isOtpVerified,setIsOtpVerified] = useState(false);
    const passref = useRef(null);
    const cpassref = useRef(null);
    const navigate = useNavigate();


    const button = isOtpSent ? "Verify & Proceed" : "Send OTP";

    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
    const handleChange = (index, value) => {
        if (value === '' && index > 0) {
          // If backspace is pressed and there's a previous input field, focus on it
          inputRefs[index - 1].current.focus();
        } else if (value.length === 1 && index < inputRefs.length - 1) {
          // If a letter is inserted and there's another input field, focus on it
          inputRefs[index + 1].current.focus();
          // Clear the current input
        //   inputRefs[index].current.value = '';
        }
      };

    const sendOtp = async (e) => {
        e.preventDefault();
        setEmail(emailRef.current.value)
        if(CommonStore.role === "student"){
            if(await VerificationStore.sendOtpStudent(emailRef.current.value)){
                setIsOtpSent(true)
            }
        }
        else if(CommonStore.role === "staff" || CommonStore.role === "hod" ){
            if(await VerificationStore.sendOtpLecturer(emailRef.current.value)){
              setIsOtpSent(true)
            }
        }
        else{
           if( await VerificationStore.sendOtpPrincipal(emailRef.current.value)){
            setIsOtpSent(true)
           }
        }
    }

      const otp = async (e) => {
        e.preventDefault();
        const otp = inputRefs[0].current.value + inputRefs[1].current.value + inputRefs[2].current.value + inputRefs[3].current.value + inputRefs[4].current.value + inputRefs[5].current.value;
        console.log(otp);
        if(await VerificationStore.verifyOtp(email,otp)){
            setIsOtpVerified(true)
        }
      }

      const updatePassword = async (e) => {
        e.preventDefault();
        if(passref.current.value !== cpassref.current.value){
            return alert("Password and Confirm Password are not same")
        }
        if(CommonStore.role === "student"){
        await UserStore.ResetStudentPassword(passref.current.value)
        navigate("/login")
        }
        else if(CommonStore.role === "hod" || CommonStore.role === "staff"){
          await UserStore.ResetLecturerPassword(passref.current.value)
          navigate("/login");
        }
        else{
          await UserStore.ResetPrincipalPassword(passref.current.value)
          navigate("/login");
        }
      }
    
    return(
        <>
            {!isOtpVerified ?
                <div className="flex flex-col h-screen items-center justify-center">
                
                {
                    !isOtpSent ?
                    <>
                    <h1 className="text-3xl text-primary">OTP Verification</h1>   
                    <img src={logo} alt="" className="w-28 h-28 mt-6 " />
                    <form onSubmit={sendOtp} className="my-4 flex flex-col gap-4 w-[80%] items-center">
                    <input ref={emailRef} required type="email" placeholder="Enter your email" className="focus:outline-none bg-primary3 w-full py-3 px-2 rounded-lg mt-1" />
                    <button 
                    
                     type="submit" className="bg-primary w-[50%] py-3 rounded-full text-white" >{button}</button>
                    </form>
                    </>
                    :

                    <>
                    <p className="text-3xl text-primary w-[80%] text-center">Verification Code set to your email id</p>
                    <p className="text-primary mt-4 font-semibold text-2xl text-center w-[80%] truncate">{email}</p>
                    <form onSubmit={otp} className="w-[80%] mx-auto flex flex-col items-center gap-4">
                    <div class="flex flex-col space-y-16">
            <div class="flex flex-row items-center justify-between gap-3 my-5 mx-auto w-full max-w-xs">
            {inputRefs.map((inputRef, index) => (
        <input
          key={index}
          ref={inputRef}
          onChange={(e) => handleChange(index, e.target.value)} className="h-12 text-center rounded-sm bg-[#D9D9D9] w-9 focus:outline-none border-2 "
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              // Handle backspace key
              handleChange(index+1, '');
            }
          }}
        />
      ))}
            </div>
            </div>
            
                        <button type="submit"   className="bg-primary w-[50%] py-3 rounded-full text-white" >{button}</button>
                    </form>
                    </>
                }
              
            </div>
            :
                <div className="flex flex-col w-[100%] h-screen items-center" >
                   
                <div
                className={`h-[30%] mt-[20%] md:mt-[2%]`}
                >
                <img src={logo} className="w-40 h-40" alt="" />
                </div>
                    <h1 className="mt-[8%] text-3xl">Set New Password</h1>
            <div className="bg-primary h-[100%] flex px-6  w-[100%] rounded-tl-[100px] mt-[10%]  items-center justify-center">
              <form
                onSubmit={updatePassword}
                className="flex flex-col w-[95%] items-center"
              >
                <p className="w-full text-white mt-4 ml-3">New Password</p>
                <input
                  required
                  ref={passref}
                  className="px-5 w-[100%] py-4 rounded-full "
                  type="password"
                />

                <p className="text-white w-full mt-6 ml-3">
                  Confirm New Password
                </p>
                <input
                  required
                  ref={cpassref}
                  className="px-5 w-[100%] py-4 rounded-full "
                  type="password"
                />
                <button
                  type="submit"
                  className="w-[50%] py-4 rounded-full text-white border-[1px] mt-10 border-white"
                >
                  Reset
                </button>
              </form>
            </div>
                </div>
            }
        </>
    )
}