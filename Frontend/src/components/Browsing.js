import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCampground, faCube, faGamepad, faGraduationCap, faHouse, faComputer } from '@fortawesome/free-solid-svg-icons';
import '../styles/browsing.css';
import { useNavigate } from 'react-router-dom';


const Browsing = () => {
    const [academicStyle, setAcademicStyle] = useState('academic')
    const [householdStyle, setHouseholdStyle] = useState('household')
    const [outdoorStyle, setOutdoorStyle] = useState('outdoor')
    const [entertainmentStyle, setEntertainmentStyle] = useState('entertainment')
    const [electronicStyle, setElectronictyle] = useState('electronic')
    const [miscStyle, setMiscStyle] = useState('misc')
    const nav = useNavigate();
    const { category } = useParams();

    useEffect(() => {
        setAcademicStyle('academic')
        setHouseholdStyle('household')
        setOutdoorStyle('outdoor')
        setEntertainmentStyle('entertainment')
        setElectronictyle('electronic')
        setMiscStyle('misc')
        switch (category) {
            case 'academic':
                setAcademicStyle('academic-colored')
                break;
            case 'household':
                setHouseholdStyle('household-colored')
                break;
            case 'outdoor':
                setOutdoorStyle('outdoor-colored')
                break;
            case 'entertainment':
                setEntertainmentStyle('entertainment-colored')
                break;
            case 'electronic':
                setElectronictyle('electronic-colored')
                break;
            case 'misc':
                setMiscStyle('misc-colored')
                break;
            default:
        }
    }, [category])


    const handleClick = (category) => {
        if (category.includes('colored')) {
            nav(`/`)
            return;
        }
        console.log(category);
        nav(`/category-items/${category}`)
    }


    return (
        <div className='browsing-container'>
            <div className='category-container' id={academicStyle} onClick={() => handleClick(academicStyle)}  >
                <FontAwesomeIcon icon={faGraduationCap} className='browsing-icon' />
                <div>
                    Academics
                </div>
            </div>
            <div className='category-container' id={householdStyle} onClick={() => handleClick(householdStyle)}>
                <FontAwesomeIcon icon={faHouse} className='browsing-icon' />
                <div>
                    Household
                </div>
            </div>
            <div className='category-container' id={outdoorStyle} onClick={() => handleClick(outdoorStyle)}>
                <FontAwesomeIcon icon={faCampground} className='browsing-icon' />
                <div>
                    Outdoor
                </div>
            </div>
            <div className='category-container' id={entertainmentStyle} onClick={() => handleClick(entertainmentStyle)}>
                <FontAwesomeIcon icon={faGamepad} className='browsing-icon' />
                <div>
                    Entertainment
                </div>
            </div>
            <div className='category-container' id={electronicStyle} onClick={() => handleClick(electronicStyle)}>
                <FontAwesomeIcon icon={faComputer} className='browsing-icon' />
                <div>
                    Electronics
                </div>
            </div>
            <div className='category-container' id={miscStyle} onClick={() => handleClick(miscStyle)}>
                <FontAwesomeIcon icon={faCube} className='browsing-icon' />
                <div>
                    Miscellaneous
                </div>
            </div>


        </div>
    )
}

export default Browsing