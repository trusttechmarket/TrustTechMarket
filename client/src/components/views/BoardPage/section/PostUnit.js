import React from 'react'
import { Card, Button } from 'react-bootstrap'

function PostUnit(props) {

    return (
        <div>
           <div>
            <h2>{props.Post.title}</h2>
            <p> 작성자 {props.Post.writer}</p>
            <hr/>
            <Card style={{margin: '10px'}}>
                <Card.Header>
                   거래 지역 : {props.Post.region}
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle>{props.Post.contents}</Card.Subtitle>
                <h3>{props.Post.price}</h3>
                </Card.Body>
            </Card>
            <Button>쪽지 보내기</Button>
           </div>
        </div>
    )
}

export default PostUnit
