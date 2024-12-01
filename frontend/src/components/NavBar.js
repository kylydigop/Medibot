import React from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "15vh",
                width: "100%",
                backgroundColor: "#353535",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "30px",
                    cursor: "pointer",
                }}
                onClick={() => navigate("/")}
            >
                <img
                    src="/medisation-logo.png"
                    alt="medisation-logo"
                    style={{ 
                        height: '5rem',
                        marginLeft: '2rem', 
                        marginRight: '1rem' }}
                />
                <span
                    style={{
                        fontSize: '5rem',
                        fontWeight: 'bold',
                        fontFamily: 'Inter',
                        color: 'white',
                      }}
                >
                    MediSation
                </span>   
            </div>
        </div>
    );
};

export default NavBar;
