import React from "react";
import { Carousel } from "react-bootstrap"
import { useState } from "react";

function ControlledCarousel(props) {
    const [index, setIndex] = useState(0);
    
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
  
    return (
      <Carousel activeIndex={index} onSelect={handleSelect}
      style={{width:"1080px", height:"720px"}}>
        {props.Imagefiles.map((eachFile,index)=>{
            return  <Carousel.Item  className={index===0?"carousel-item active":"carousel-item "} 
            style={{width:"100%", height:"720px"}}key={`${eachFile}img`}>
        <img src={`data:image/jpeg;base64,${eachFile}`} class="d-block img-fluid  w-100 " style={{height:"100%",width:"100%",objectFit:"cover"}} alt="..."/>
      </Carousel.Item>
        })}
      </Carousel>
    );
}
  
export default ControlledCarousel
