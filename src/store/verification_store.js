import { makeAutoObservable } from "mobx";
import { apiPostPut } from "../api/api_methods";

class VerificationStore {
    constructor() {
        makeAutoObservable(this);
      }

      async sendOtpStudent(email){
        const url = "/forgotPasswordStudent"
        const body ={
            emailid: email,
        }
        const response = await apiPostPut(body,url,"POST");
        if(response.status===200){
            alert(`${response?.body?.message}`)
            localStorage.setItem("id",JSON.stringify(response?.body?.studentId))
            return true;
        }
        else{
            alert(`${response?.body?.message}`)
            return false;
        }

      }

      async sendOtpLecturer(email){
        const url = "/forgotPasswordStaff"
        const body ={
            email: email,
        }
        const response = await apiPostPut(body,url,"POST");
        if(response.status===200){
            alert(`${response?.body?.message}`)
            localStorage.setItem("id",JSON.stringify(response?.body?.staffId))
            return true;
        }
        else{
            alert(`${response?.body?.message}`)
            return false;
        }

      }

      async sendOtpPrincipal(email){
        const url = "/forgotPasswordPrincipal"
        const body ={
            email: email,
        }
        const response = await apiPostPut(body,url,"POST");
        if(response.status===200){
            alert(`${response?.body?.message}`)
            localStorage.setItem("id",JSON.stringify(response?.body?.principalId))
            return true;
        }
        else{
            alert(`${response?.body?.message}`)
            return false;
        }

      }

      async verifyOtp(email,otp){
        const url = "/verifyOTP"
        const body ={
            email:email,
            otp:otp
        }
        const response = await apiPostPut(body,url,"POST");
        if(response.status === 200){
            alert(`${response?.body?.message}`)
            return true;
        }
        else{
            alert(`${response?.body?.message}`)
            return false;
        }
      }
}

export default VerificationStore;