import React from 'react';
import LOGOPDLAWYERS from '../../img/LogoAplix.png';

const Logo = () => {
    return (
        <div className="logo">   
            <div className="logo-icon">
                <img className="logo-img" src={LOGOPDLAWYERS} alt="Logo PD Lawyers" /> 
            </div>
        </div>
    );
}

export default Logo;
