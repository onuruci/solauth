import React from "react";
import { useState, useEffect, useContext, useMemo } from "react";
import WalletHandler from "./WalletHandler";


const Login = ({setCurrentProfile}) => {
  return (
    <div>
      <div className="containerr">
        <div className="content">
           <div className="left-content">
               <div className="f-logo">
                   <img src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" alt="Facelook" />
               </div>
               <h2 className="f-quote">Facelook helps you connect and share with the people in your life.</h2>
           </div>
           <div className="right-content">
               <div className="card">
                   <form>
                       <div className="input-container">
                           <input type="text" placeholder="Email address or phone number" />
                       </div>
                       <div className="input-container">
                            <input type="password" placeholder="Password" />
                        </div>
                        <div className="login-btn-container">
                            <button className="login-btn">Log In</button>
                        </div>
                        <WalletHandler setCurrentProfile={setCurrentProfile} />
                   </form>

                   <div className="forgotten-password">
                       <a href="#">Forgotten Password?</a>
                   </div>

                   <div className="divider"></div>

                   <div className="" style={{"text-align": "center"}}>
                       <a className="crt-new-ac" href="#">Create New Account</a>
                   </div>
               </div>
           </div>
        </div>
    </div>
    <footer className="f-lg-footer">
        <ul>
            <li><a href="">English (UK)</a></li>
            <li><a href="">বাংলা</a></li>
            <li><a href="">हिन्दी</a></li>
            <li><a href="">اردو</a></li>
            <li><a href="">नेपाली</a></li>
            <li><a href="">ଓଡ଼ିଆ</a></li>
            <li><a href="">Español</a></li>
            <li><a href="">Português (Brasil)</a></li>
            <li><a href="">Français (France)</a></li>
            <li><a href="">Deutsch</a></li>
            <li><a href="">Italiano</a></li>
        </ul>
        <div className="divider"></div>
        <ul>  
            <li><a href="">Sign Up</a></li>
            <li><a href="">Log In</a></li>
            <li><a href="">Messenger</a></li>
            <li><a href="">Facelook Lite</a></li>
            <li><a href="">Watch</a></li>
            <li><a href="">Places</a></li>
            <li><a href="">Games</a></li>
            <li><a href="">Marketplace</a></li>
            <li><a href="">Facelook Pay</a></li>
            <li><a href="">Jobs</a></li>
            <li><a href="">Oculus</a></li>
            <li><a href="">Portal</a></li>
            <li><a href="">Instagram</a></li>
            <li><a href="">Local</a></li>
            <li><a href="">Fundraisers</a></li>
            <li><a href="">Services</a></li>
            <li><a href="">Voting</a></li>
            <li><a href="">Information Centre</a></li>
            <li><a href="">About</a></li>
            <li><a href="">Create ad</a></li>
            <li><a href="">Create Page</a></li>
            <li><a href="">Developers</a></li>
            <li><a href="">Careers</a></li>
            <li><a href="">Privacy</a></li>
            <li><a href="">Cookies</a></li>
            <li><a href="">AdChoices</a></li>
            <li><a href="">Terms</a></li>
            <li><a href="">Help</a></li>
            <li><a href="">Settings</a></li>
        </ul>
    </footer>

    <div className="m-footer">
        <div className="m-f-lang">
            <ul>
                <li><a href="">English (UK)</a></li>
                <li><a href="">বাংলা</a></li>
                <li><a href="">हिन्दी</a></li>
            </ul>
            <ul>
                <li><a href="">اردو</a></li>
                <li><a href="">नेपाली</a></li>
                <li><a href="">ଓଡ଼ିଆ</a></li>
            </ul>
        </div>
        

        <div  style={{clear: "both"}}></div>

        <div className="links"  style={{"text-align": "center"}}>
            <a href="#">About</a><a href="#">Help</a><a href="#">More</a>
        </div>

    </div>
    </div>
  );
};

export default Login;