import styles from './Error.module.css';
import { Link } from 'react-router-dom';

function Error(){
return <div className={styles.errorWrapper}>
    <div className={styles.errorHeader}>Error 404 - No Page Found</div>
    <div className={styles.body}> Go Back to <Link to='/' className={styles.homeLink}>HomePage</Link></div>

</div>
}

export default Error;