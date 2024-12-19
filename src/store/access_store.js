import { makeAutoObservable } from "mobx";
import { apiPostPut } from "../api/api_methods";

class AccessStore {
  constructor() {
    makeAutoObservable(this);
  }
  hodAccessTime = null;


  loadRoleFromLocalStorage() {
    const savedTime = localStorage.getItem("time");
    if (savedTime) {
      this.setAccessTime(savedTime);
    }

  }

  setAccessTime(time) {
    this.hodAccessTime = time;
    localStorage.setItem("time", time);
  }

  async AccessLecturers(expiresAt, id) {
    const url = `/setAccessExpirationHOD/${id}`
    const body = {
      access: {
        granted: true,
        expiresAt: expiresAt
      }
    }
    const response = await apiPostPut(body, url, "POST")
    if (response.status === 200) {
      return true;
    }
    alert("failed to give access")
    return false;
  }

  async AccessStudents(expiresAt, id) {
    const url = `/setAccessExpiration/${id}`
    const body = {
      access: {
        granted: true,
        expiresAt: expiresAt
      }
    }
    const response = await apiPostPut(body, url, "POST")
    if (response.status === 200) {
      return true;
    }
    alert("failed to grant access")
    return false;
  }

}
export default AccessStore;
