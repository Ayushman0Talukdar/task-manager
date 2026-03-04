import React, { useState } from "react";
import "../styles/Sidebar.css"
import { NavLink } from "react-router-dom";
import { MaterialSymbolsLightDashboardRounded } from "../icons/dashboardicon";
import { MynauiAcademicHat } from "../icons/buildingicon";

export const Sidebar = ({bar}) =>{

    return (
        <div className="Sidebar" style={{left: bar ? "0" : "calc(-20% - 40px)"}}>
        <div>
            <div className="Title bodoni-moda"><div>Twix</div></div>
            <div className="tabs">
                <NavLink to={'/'} className={({ isActive }) => 
                `textDefault ${isActive ? "Active" : "defaultfont"} roboto Li `
            }><MaterialSymbolsLightDashboardRounded/>Dashboard</NavLink>
                {/* <NavLink to={'/process'} className={({ isActive }) => 
                `${isActive ? "Active" : "defaultfont"} textDefault roboto Li`
            }><MynauiAcademicHat />Process</NavLink> */}
            </div>
            {/* <div className="settings">settings</div> */}
        </div>
        </div>
    )
}