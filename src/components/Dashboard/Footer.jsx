import React from 'react'
import image from "../Assets/Images/images.png"
import insta from "../Assets/Images/instagram.png"
import whatsapp from "../Assets/Images/whatsapp.png"
import youtube from "../Assets/Images/youtube.png"
import linkedln from "../Assets/Images/likedin.png"
import twitter from "../Assets/Images/twitter.png"


function Footer() {
    return (
        <>
            <footer style={{ position: "relative", right: "0", width: "100%" }} className="py-lg-8 py-5 footer bg-white text-black ">
                <div style={{ marginRight: "50px" }} className="container">
                    <div className="row gy-4">
                        {/* About Company */}
                        <div className="col-lg-4 col-12">
                            <div className="d-flex flex-column gap-4">
                                <div>
                                    <img style={{ width: "200px", height: "auto" }}
                                        src={image}
                                        alt="Geeks"
                                        className="logo-reverse"
                                    />
                                </div>
                                <div>
                                    <p className="mb-0 text-gray-500">
                                        Connecting founders and marketers with battle-hardened mentors
                                        that genuinely enjoy helping people.
                                    </p>
                                </div>
                                {/* Social links */}
                                <div>
                                    <h4>Contact us</h4>
                                    <a href="#"><img  style={{width:"30px",height:"30px", margin:"5px 5px 5px 0px",padding:"5px",cursor:"pointer"}}  src={insta} ></img></a>
                                    <a href="#"><img  style={{width:"30px",height:"30px", margin:"5px",padding:"5px",cursor:"pointer"}}  src={whatsapp}></img></a>
                                    <a href="#"><img  style={{width:"30px",height:"30px", margin:"5px",padding:"5px",cursor:"pointer"}}  src={linkedln} ></img></a>
                                    <a href="#"><img  style={{width:"30px",height:"30px", margin:"5px",padding:"5px",cursor:"pointer"}}  src={youtube} ></img></a>
                                    <a href="#"><img  style={{width:"30px",height:"30px", margin:"5px",padding:"5px",cursor:"pointer"}}  src={twitter}  ></img></a>
                                </div>
                            </div>
                        </div>

                        {/* Platform */}
                        <div className="col-lg-2 col-md-3 col-6">
                            <h5 className="fw-bold text-uppercase mb-3">Platform</h5>
                            <ul className="list-unstyled nav nav-footer flex-column">
                                <li><a href="/" className="nav-link text-black-50">Browse Mentors</a></li>
                                <li><a href="/" className="nav-link text-black-50">Book a Session</a></li>
                                <li><a href="/" className="nav-link text-black-50">Become a Mentor</a></li>
                                <li><a href="/" className="nav-link text-black-50">Wall Of Love</a></li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className="col-lg-2 col-md-3 col-6">
                            <h5 className="fw-bold text-uppercase mb-3">Resources</h5>
                            <ul className="list-unstyled nav nav-footer flex-column">
                                <li><a href="/" className="nav-link text-black-50">Newsletter</a></li>
                                <li><a href="/" className="nav-link text-black-50">Case Studies</a></li>
                                <li><a href="/" className="nav-link text-black-50">Books</a></li>
                                <li><a href="/" className="nav-link text-black-50">Templates</a></li>
                                <li><a href="/" className="nav-link text-black-50">Blog</a></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div className="col-lg-2 col-md-3 col-6">
                            <h5 className="fw-bold text-uppercase mb-3">Company</h5>
                            <ul className="list-unstyled nav nav-footer flex-column">
                                <li><a href="/" className="nav-link text-black-50">About</a></li>
                                <li><a href="/" className="nav-link text-black-50">Partner Program</a></li>
                                <li><a href="/" className="nav-link text-black-50">Privacy Policy</a></li>
                                <li><a href="/" className="nav-link text-black-50">Meet the Team</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div className="col-lg-2 col-md-3 col-6">
                            <h5 className="fw-bold text-uppercase mb-3">Support</h5>
                            <ul className="list-unstyled nav nav-footer flex-column">
                                <li><a href="/" className="nav-link text-black-50">FAQ</a></li>
                                <li><a href="/" className="nav-link text-black-50">Contact</a></li>
                                <li><a href="/" className="nav-link text-black-50">Help Centre</a></li>
                                <li><a href="/" className="nav-link text-black-50">Join Community</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="row mt-lg-7 mt-5">
                        <div className="col-lg-6 offset-lg-3 col-12 text-center">
                            <span>
                                © {new Date().getFullYear()} . All Rights Reserved.
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
