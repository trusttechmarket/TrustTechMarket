import React, { useState, useEffect } from 'react';
import {Card, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';

function BoardCard(props) {
    const [Post_sn, setPost_sn] = useState();
    const [Title, setTitle] = useState("제목");
    const [Writer, setWriter] = useState("작성자");
    const [Contents, setContents] = useState("본문");    
    const [Mainimage, setMainimage] = useState(null);
    const [Price, setPrice] = useState("");

    useEffect(() => {
        setTitle(props.Title);
        setContents(props.Contents);
        setMainimage(props.ImageURL);
        setPrice(props.Price);
        setWriter(props.Writer);
        setPost_sn(props.Post_sn);
        return () => {
        }
    }, [])

    const styles = {
        card: {
          width: '18rem',
        },
        cardImage: {
          width: '18rem',
          height: '18rem',
          objectFit: 'cover',
        }
    }
    
    return (
        <div>
            <Card style={styles.card}>
                <Card.Img variant="top" src={require('../../../img/KakaoTalk_Photo_2021-12-01-06-14-58.jpeg')} style ={styles.cardImage}/>
                <Card.Body>
                    <Card.Title>{Title}</Card.Title>
                    <Card.Subtitle>{Price} 원</Card.Subtitle>
                    <Card.Text>
                        {Writer}
                    </Card.Text>
                    <Link to={`/board/${Post_sn}`}><Button variant="primary" >제품 보기</Button></Link>
                </Card.Body>
            </Card>
        </div>
    )
}

export default BoardCard
