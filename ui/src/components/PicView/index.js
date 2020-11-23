import { history, useLocation } from 'umi';

export default function PicView(props) {
    const { src } = props
    const { query: { showPic: show } } = useLocation()

    if (show && !src) {
        history.goBack()
    }
    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            backgroundColor: 'black',
            height: show ? '100vh' : '0',
            width: '100%',
            zIndex: '110',
            overflow: 'hidden',
            transition: 'all 0.3s'
        }}>
            <span style={{ color: 'white', position: 'absolute', transform: 'translate(10px,10px)' }} onClick={() => history.goBack()}>Back</span>
            { <img src={src} style={{ width: '100%', position: 'absolute', top: '50%', transform: 'translate(0,-50%)' }} />}
        </div>
    )
}
