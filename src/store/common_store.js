import { makeAutoObservable } from "mobx";

class CommonStore {
  constructor() {
    makeAutoObservable(this);
    this.loadRoleFromLocalStorage();
  }

  role = null;
  state = null;
  district = null;
  college = null;

  loadRoleFromLocalStorage() {
    const savedRole = localStorage.getItem("role");
    const savedState = localStorage.getItem("state");
    const savedDistrict = localStorage.getItem("district");
    const savedCollege = localStorage.getItem("college");
    if (savedRole) {
      this.setRole(savedRole);
    }
    if (savedState) {
      this.setState(savedState);
    }
    if (savedDistrict) {
      this.setDistrict(savedDistrict);
    }
    if (savedCollege) {
      this.setCollege(savedCollege);
    }

  }

  setRole(role) {
    this.role = role;
    localStorage.setItem("role", role);
  }

  setState(state) {
    this.state = state;
    localStorage.setItem("state", state);
  }

  setDistrict(district) {
    this.district = district;
    localStorage.setItem("district", district);
  }

  setCollege(college) {
    this.college = college;
    localStorage.setItem("college", college);
  }
}

export default CommonStore;
