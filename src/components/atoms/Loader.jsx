import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function SkeletonUI(){
return <>

      <SkeletonTheme baseColor="#202020" highlightColor="#444">
    <p>
      <Skeleton count={5}   style={{
        border: '1px solid #101828',
        display: 'block',
        lineHeight: 2,
        padding: '1rem',
        marginBottom: '0.5rem',
        
      }} />
    </p>
  </SkeletonTheme>    

</>
}