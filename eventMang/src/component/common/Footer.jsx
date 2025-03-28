import React from 'react'

function Footer() {
  return (
    <div>Footer</div>
  )
}

export default Footer



// import { FaLinkedin, FaSquareXTwitter , FaSquareInstagram, FaSquareYoutube, FaSquareFacebook   } from "react-icons/fa6";
// import { useNavigate } from "react-router-dom";

// // todo :- add social icons
// function Footer() {
//   const navigate = useNavigate();
//   return (
//     <footer className="bg-black text-white p-8">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
//         {/* Logo and tagline */}
//         <div>
//           <div className="h-[200px] w-auto overflow-hidden">
//             <img src="logo" alt="Worzo Logo" className="h-full w-auto mb-4 " />
//           </div>
//         </div>

//         {/* Bikes Section */}
//         <div>
//           <h4 className="font-semibold text-lg mb-2">Bikes</h4>
//           {/* <ul className="space-y-1">
//             {
//               products?.data?.map((product,idx)=>(
//               <li key={idx} className="cursor-pointer" onClick={()=>navigate(`product/${product._id}`)}>{product.name}</li>
//               ))
//             }
            
            
//           </ul> */}
//         </div>

//         {/* Reach us Section */}
//         <div>
//           <h4 className="font-semibold text-lg mb-2">Reach us</h4>
//           <p>Worzo EV Head Office:</p>
//           <p>Bagla Road, Hisar, India, Haryana</p>
//           <p className="mt-4">WORZO EV Corporate Office:</p>
//           <p>SCO 95 PLA, Hisar Haryana</p>
//           <p className="mt-4">Factory Outlet:</p>
//           <p>SCO 197 Auto Market, Hisar Haryana</p>
//         </div>
            
//         {/* quick links  */}
//         <div>
//           <h4 className="font-semibold text-lg mb-2">Quick Links</h4>
//           <p onClick={() => navigate("/")} className="cursor-pointer">Home</p>
//           <p onClick={() => navigate("/why-worzo")} className="cursor-pointer">Why Worzo? </p>
//           <p onClick={() => navigate("/our-story")} className="cursor-pointer">Our Story</p>
//           <p onClick={() => navigate("/blog")} className="cursor-pointer">Blogs</p>
//           <p onClick={() => navigate("/dealer-locator")} className="cursor-pointer">Dealer Locator</p>
//           <p onClick={() => navigate("/become-a-dealer")} className="cursor-pointer"> Become a Dealer </p>
//           <p onClick={() => navigate("/Warranty-support")} className="cursor-pointer">Warranty & Support</p>
//           <p onClick={() => navigate("/faq")} className="cursor-pointer">FAQs</p>
//           <p onClick={() => navigate("/ev-benefits")} className="cursor-pointer">EV Benefits</p>
//           <p onClick={() => navigate("/contact-us")} className="cursor-pointer">Contact Us </p>
//           {/* Social Media Links */}
//           <div className="flex space-x-4 mt-6">
//             <a
//               href="#"
//               aria-label="Twitter"
//               className="text-gray-500 hover:text-white"
//             >
//               <i className="fab fa-twitter-square text-2xl"></i>
//             </a>
//             <a
//               href="#"
//               aria-label="Instagram"
//               className="text-gray-500 hover:text-white"
//             >
//               <i className="fab fa-instagram text-2xl"></i>
//             </a>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col-reverse sm:flex-row justify-between items-center">
//         <p className="text-gray-400 text-sm mt-4 ">
//           2025 ©Copyright Worzo. All Rights Reserved.
//         </p>
//         <div className="flex gap-4 mr-16">
//           <FaLinkedin
//             className="h-[30px] w-auto cursor-pointer"
//             onClick={() =>
//               window.open("https://www.linkedin.com/company/worzoin", "_blank")
//             }
//           />
//           <FaSquareXTwitter
//             className="h-[30px] w-auto cursor-pointer"
//             onClick={() => window.open("https://x.com/worzoin", "_blank")}
//           />
//           <FaSquareYoutube
//             className="h-[30px] w-auto cursor-pointer"
//             onClick={() => window.open("https://youtube.com/@worzoin?si=uln_d1ol6VotM8V7", "_blank")}
//           />
//           <FaSquareFacebook
//             className="h-[30px] w-auto cursor-pointer"
//             onClick={() => window.open("https://www.facebook.com/worzo.in/", "_blank")}
//           />
//           <FaSquareInstagram
//             className="h-[30px] w-auto cursor-pointer"
//             onClick={() =>
//               window.open(
//                 " https://www.instagram.com/worzo.in?igsh=MTk3MXBzYW9mMzYybw==",
//                 "_blank"
//               )
//             }
//           />
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;
