import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config";

const StudentDetails = () => {
    const [students, setStudents] = useState([]);

    const fetchStudents = async () => {
        try {
            const response = await fetch(`${BASE_URL}/students`);
            const data = await response.json();
            const verifiedStudents = data.filter((student) => student.isVerified);
            setStudents(verifiedStudents);
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? "Not yet logged" : date.toLocaleString();
    };

    return (
        <div className="flex flex-col justify-center items-center bg-gray-50">
            <div className="w-full mt-[5%] bg-red-400 text-white text-center py-6 text-4xl font-bold">
                Verified Student Details
            </div>
            <div className="overflow-x-auto mt-[3%] w-[90%]">
                {students.length === 0 ? (
                    <div className="text-center text-gray-500">No verified students</div>
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
                                <th className="border border-gray-300 px-4 py-2">Created At</th>
                                <th className="border border-gray-300 px-4 py-2">Last Logged</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{student.pinno}</td>
                                    <td className="border border-gray-300 px-4 py-2">{student.year}</td>
                                    <td className="border border-gray-300 px-4 py-2">{student.department}</td>
                                    <td className="border border-gray-300 px-4 py-2">{student.emailid}</td>
                                    <td className="border border-gray-300 px-4 py-2">{student.studentmobile}</td>
                                    <td className="border border-gray-300 px-4 py-2">{formatDate(student.createdAt)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{formatDate(student.lastlogged)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StudentDetails;
