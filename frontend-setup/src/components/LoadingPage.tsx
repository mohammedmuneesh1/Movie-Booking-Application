import  { useEffect } from 'react'
import {useNavigate, useSearchParams } from 'react-router-dom';
import Loading from './Loading';


const LoadingPage = () => {


const [params] = useSearchParams();
const nextUrl = params.get("next");
const navigate = useNavigate();

useEffect(()=> {
  if (!nextUrl){ 
     navigate('/',{replace:true});
     return;
    }
    const timer = setTimeout(() => {
     navigate(nextUrl);
     }, 8000);
  return () => clearTimeout(timer);
}, [nextUrl, navigate]);


    
  return (
    <Loading />
  )
}

export default LoadingPage