export const Preview = ({files}) => {
    if (!files.length) {
        return null
    };

    return files.map((file) => <img src={file.filename} alt={file.originalname}/>)
}