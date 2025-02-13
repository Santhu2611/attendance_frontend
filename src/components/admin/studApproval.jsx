import React, { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../../config";

const StudentActivations = () => {
  const [students, setStudents] = useState([]);
  const hasFetched = useRef(false);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/students`);
      const data = await response.json();
      const unverifiedStudents = data.students.filter(
        (student) => !student.isVerified
      );
      setStudents(unverifiedStudents);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {  // ✅ Runs only on first render
      fetchStudents();
      hasFetched.current = true;
    }
  }, []);

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isVerified: true }),
      });

      if (response.ok) {
        alert("Student approved successfully");
        fetchStudents();
      } else {
        alert("Failed to approve student");
      }
    } catch (error) {
      console.error("Error approving student:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/students/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Student rejected successfully");
        await fetchStudents();
      } else {
        alert("Failed to reject student");
      }
    } catch (error) {
      console.error("Error rejecting student:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-50">
      <div className="w-full mt-[5%]  bg-red-400 text-white text-center py-6 text-4xl font-bold">
        Student Approvals
      </div>
      <div className="overflow-x-auto mt-[3%] w-[90%]">
        {students.length === 0 ? (
          <div className="text-center text-gray-500">
            No students to approve
          </div>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-red-300 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Id</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Roll No</th>
                <th className="border border-gray-300 px-4 py-2">Year</th>
                <th className="border border-gray-300 px-4 py-2">Department</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.pinno}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.year}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.department}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.emailid}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.studentmobile}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.isVerified ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                      onClick={() => handleApprove(student._id)}>
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleReject(student._id)}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentActivations;
