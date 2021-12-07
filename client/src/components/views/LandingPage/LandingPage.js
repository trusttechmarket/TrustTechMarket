import React, { useEffect,useState } from 'react'

function LandingPage() {
    const [recentImage, setrecentImage] = useState([]);
    const [recentName, setrecentName] = useState([]);
    const [populerImage, setpopulerImage] = useState([]);
    const [populerName, setpopulerName] = useState([]);
    

    useEffect(() => {
        setrecentImage(['img1.png','img1.png','img1.png','img1.png','img1.png','img1.png'])
        setpopulerImage(['img1.png','img1.png','img1.png','img1.png','img1.png','img1.png'])
        setrecentName(['핸드폰','노트북','i마우스','i패드','맥북','스피커'])
        setpopulerName(['i패드','핸드폰','노트북','i마우스','맥북','스피커'])
    })


    return (
        <div style={{width: '100%', height: '100vh'}}>
            {/* 메인 image */}
            <div style={{width: '85%', margin: '1rem auto'}}>
                <h2> 최근 등록된 상품 </h2>
                {/* grid 1 */}
                <hr/>
            </div>
            <div style={{width: '85%', margin: '1rem auto'}}>
                <h2> 많이 찜한 상품 </h2>
                {/* grid 2 */}
                <hr/>
            </div>
            

        </div>
    )
}

export default LandingPage