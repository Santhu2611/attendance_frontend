import React from "react";
import { useNavigate } from "react-router-dom";
import { Branches } from "../helpers/Branches";
import { useParams } from "react-router-dom";
import Approval from "./Approval";

export default function StudentApprovalDetails() {
  return <Approval navigation={true} />;
}
