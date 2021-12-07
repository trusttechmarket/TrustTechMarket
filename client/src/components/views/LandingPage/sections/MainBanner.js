import react from "react";

function MainBanner () {
    return (
        <div>
            <div style={{position:'absolute', maxWidth:'500px', bottom:'2rem'}}>
                <h2 style={{color: 'white'}}> title </h2>
                <p style={{color: 'white', fontSize: '1rem'}}>description</p>
            </div>
        </div>
    )
}