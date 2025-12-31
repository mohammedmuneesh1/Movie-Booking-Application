import React from 'react'



interface AdminTitleInterface{
    firstTitle:string;
    secondTitle?:string;
    firstTitleClass?:string;

}

const AdminTitle:React.FC<AdminTitleInterface> = ({firstTitle,secondTitle,firstTitleClass}) => {


  return (
       <h2
        className={`text-xl md:text-2xl font-semibold tracking-wider capitalize ${firstTitleClass}` }
        > 
       {firstTitle} {/*  */}
       <span className="text-primary underline">
        {secondTitle ?? ""}
        </span>


        </h2>
  )
}

export default AdminTitle