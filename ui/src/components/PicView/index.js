import { history } from 'umi';

export default function PicView(props) {
    const { src } = props
    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            backgroundColor: 'black',
            height: '100vh',
            width: '100%',
            zIndex: '199',
            overflow: 'hidden',
        }}>
            <span style={{ color: 'white', position: 'absolute', transform: 'translate(10px,10px)' }} onClick={() => history.goBack()}>Back</span>
            <img src={src} style={{ width: '100%', position: 'absolute', top: '50%', transform: 'translate(0,-50%)' }} />
        </div>
    )
}
