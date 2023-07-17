import React from 'react';

function VideoComponent(props) {
    return (
        <div>
            <video src={props.src}
            ></video>
            <h1>{props.heading}</h1>
            <p>{props.description}</p>
        </div>
    )
}

export const ChoosingCollege = () => {
    return (
        <VideoComponent
        src=''
        heading='Choosing the best colleges'
        description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        />
    )
}

export const PayingCollege = () => {
    return (
        <VideoComponent
        src=''
        heading='Paying for college'
        description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        />
    )
}

export const Tutor = () => {
    return (
        <VideoComponent
        src=''
        heading='Finding the right tutor'
        description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        />
    )
}

export const Talent = () => {
    return (
        <VideoComponent
        src=''
        heading='Demonstrating talent and social responsibility'
        description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        />
    )
}

export const Essay = () => {
    return (
        <VideoComponent
        src=''
        heading='Writing the essay'
        description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        />
    )
}

export const Letter = () => {
    return (
        <VideoComponent
        src=''
        heading='Making recommendation letters impactful'
        description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        />
    )
}
