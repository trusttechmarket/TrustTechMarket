import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {Card, Button} from 'react-bootstrap';

function BoardCard(props) {
    const [Title, setTitle] = useState("제목");
    const [Writer, setWriter] = useState("작성자");
    const [Contents, setContents] = useState("본문");    
    const [Mainimage, setMainimage] = useState(null);
    const [Price, setPrice] = useState("");

    useEffect(() => {
        setTitle(props.Title);
        setContents(props.Contents);
        setMainimage(props.ImageURL);
        setPrice("₩  "+props.Price);
        setWriter(props.Writer);
        return () => {
        }
    }, [])

    const styles = {
        card: {
          width: '21rem',
          borderRadius: 20,
        },
        cardImage: {
          width: '21rem',
          height: '21rem',
          objectFit: 'cover',
          borderRadius: 20
        }
      }

    return (
        <div>
            <Card style={styles.card}>
                <Card.Img variant="top" src={require('../../../img/KakaoTalk_Photo_2021-12-01-06-14-58.jpeg')} style ={styles.cardImage}/>
                <Card.Body>
                    <Card.Title>{Title}</Card.Title>
                    <Card.Subtitle>{Price}</Card.Subtitle>
                    <Card.Text>
                        {Contents}
                    </Card.Text>
                    <Button variant="primary">제품 보기</Button>
                </Card.Body>
            </Card>
        </div>
    )
}

export default BoardCard
