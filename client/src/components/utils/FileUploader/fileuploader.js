import './fileuploader.css'
import React , {useState}  from 'react';
import axios from 'axios';

export const FileUploader = ({}) => {
    const [file, setfile] = useState(null)

    const onInputChange = (e) => {
        console.log(e.target.files);
        setfile(e.target.files[0])
    };
    const onSubmitHandler = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('file',file);

        axios.post('/api/board/write', data)
        .then((e) => {
            console.log('Succes')
        })
        .catch((e) => {
            console.error('Error', e);
        })
    };

        return ( 
    <form method="post" action="#" id="#" omnSubmit={onSubmitHandler} >
    <div class="form-group files">
        <label>Upload Your File </label>
        <input type="file" 
            class="form-control" 
            multiple=""
            onChange={onInputChange}/>
    </div>
    </form>)
}