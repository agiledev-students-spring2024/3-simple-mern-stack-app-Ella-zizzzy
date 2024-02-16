
import React, { useState, useEffect } from 'react';

function AboutUs() {
    const [aboutUsContent, setAboutUsContent] = useState({ paragraphs: [], imageUrl: '', title: '' });

    useEffect(() => {
        const apiUrl = "http://localhost:5002/aboutus"; 
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {setAboutUsContent(data);})
            .catch(error => console.error('Error fetching About Us content:', error));
    }, []); 

    return (
        <div>
            <h1>{aboutUsContent.title}</h1>
            {aboutUsContent.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
            <img src={aboutUsContent.imageUrl} alt="About Us" className="profile-pic" />
        </div>
    );
}

export default AboutUs;
