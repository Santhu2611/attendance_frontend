import React from "react"
import image from "../assets/Animation.gif";
import abtpg from "../assets/aboutpage.png"
import ReactSwipe from 'react-swipe';
import { IoChevronBack } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
const Welcome = () => {
    const navigate = useNavigate();
    let reactSwipeEl;
    return (
        <div className="h-[100%]">
            <div >
                <div>
                    <ReactSwipe
                        className="carousel"
                        swipeOptions={{ continuous: false }}
                        ref={el => (reactSwipeEl = el)}
                    >
                        <div>
                            <h1 className="font-bold text-xl md:w-[50%] my-[10%] justify-center items-center flex">Welcome</h1>
                            <div className="justify-center flex">
                                <img className="h-[50%]" src={image} alt="Learn" />
                            </div>
                            <div className="p-[10%] mt-20 h-[30%]"><p><b>The Student Data Management System (SDMS)</b> is a revolutionary solution for streamlined certificate management in educational institutions, developed by a dedicated team from <b>Government Polytechnic, Pendurthi</b>. Leveraging cutting-edge technology, SDMS transforms the handling of student data, enhancing organizational efficiency.</p>
                            </div>
                            <div className="flex justify-center list-none mt-12">
                                <li className="text-primary"><GoDotFill /></li>
                                <li className="text-slate-300"><GoDotFill /></li>
                                <li className="text-slate-300"><GoDotFill /></li>
                            </div>
                            <div className="w-[100%] flex justify-center mt-4">
                                {/* <button className="text-xl mr-6 text-primary rounded-md bg-slate-200 border-2px border-blue-950 p-2" onClick={() => reactSwipeEl.prev()}><IoChevronBack /></button> */}
                                <button className="text-white  bg-blue-900 rounded-md p-4 px-20 w-[80%]" onClick={() => reactSwipeEl.next()}>Continue</button>
                            </div>
                        </div>
                        <div>
                            <div>
                                <h1 className="font-bold text-xl md:w-[50%] mt-[10%] justify-center items-center flex">About</h1>
                                <div className="my-10 mx-24">
                                    <img className="h-[20%]" src={abtpg} alt="Learn" />
                                </div>
                                <div className="p-[10%]">
                                    <p><b>SDMS</b> a collaborative effort by five individuals from Government Polytechnic, Pendurthi, showcases the team's commitment and ingenuity in creating a comprehensive certificate management solution. With the support of the <b>Spotmies</b> team, SDMS aligns seamlessly with top-tier standards in functionality, security, and user-friendliness.</p>
                                </div>
                                <div className="flex justify-center list-none">
                                    <li className="text-slate-300"><GoDotFill /></li>
                                    <li className="text-primary"><GoDotFill /></li>
                                    <li className="text-slate-300"><GoDotFill /></li>
                                </div>
                            </div>
                            <div className="w-[100%] flex justify-center mt-4 ">
                                <button className="text-xl mr-6 text-primary rounded-md bg-slate-200 border-2px border-blue-950 p-2" onClick={() => reactSwipeEl.prev()}><IoChevronBack /></button>
                                <button className="text-white  bg-blue-900 rounded-md p-4 px-20" onClick={() => reactSwipeEl.next()}>Continue</button>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>
                                    <h1 className="font-bold text-xl md:w-[50%] mt-[10%] justify-center items-center flex">Content consent <br />and user agreement</h1>
                                    <div className="my-14 mx-24">
                                        <img className="h-[20%]" src={image} alt="Learn" />
                                    </div>
                                    <div className="p-[10%]">
                                        <p>In the realm of academic institutions, the need for an effective Student Data Management System becomes paramount.SDMS is a user-friendly and comprehensive solution designed to empower both administrators and students. Let's embark on a journey that simplifies administrative processes, enhances accessibility, and ensures secure management of academic records.</p>
                                    </div>
                                    <div className="flex justify-center list-none">
                                        <li className="text-slate-300"><GoDotFill /></li>
                                        <li className="text-slate-300"><GoDotFill /></li>
                                        <li className="text-primary"><GoDotFill /></li>
                                    </div>
                                </div>
                                <div className="w-[100%] flex justify-center mt-2">
                                    <button className="text-xl mr-6 text-primary rounded-md bg-slate-200 border-2px border-blue-950 p-2" onClick={() => reactSwipeEl.prev()}><IoChevronBack /></button>
                                    <button className="text-white  bg-blue-900 rounded-md p-4 px-20" onClick={() => navigate("/welcome")}>I Agree</button>
                                </div>
                            </div>
                        </div>
                    </ReactSwipe>

                </div>

                {/* <div className="w-[100%] flex justify-center mt-2">
                    <button className="text-xl mr-6 text-primary rounded-md bg-slate-200 border-2px border-blue-950 p-2" onClick={() => reactSwipeEl.prev()}><IoChevronBack /></button>
                    <button className="text-white  bg-blue-900 rounded-md p-4 px-20" onClick={() => reactSwipeEl.next()}>Continue</button>
                </div> */}

            </div>

        </div>
    )
}
export default Welcome;

