import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../style.css'

const Layout = props => (
    <div className='main'>
        {props.children}
    </div>
)
export default Layout