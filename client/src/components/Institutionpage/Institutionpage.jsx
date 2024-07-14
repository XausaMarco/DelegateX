import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Institutionpage.css'

function Institutionpage({authenticated,institution}){

    const [delegations, setDelegations]=useState(<></>);

    const navigate=useNavigate();
    
    useEffect(()=>{
        if(!authenticated)
            navigate("/error");
    });

    async function handleSubmit1(e){
        e.preventDefault();
        let service =e.target.service.value;
        let vat=institution.vat
        
        var toBeSent={
            vat:vat,
            service:service
        };

        console.log(toBeSent)

        await fetch("http://localhost:3000/v1/addservice",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(toBeSent)
        }) 
        .then(response => {
            return response.json();
        })

    }

    function handleFormViewDelegations(e){
        e.preventDefault(); 
        
        
        let userAddress =e.target.address.value;
        let vat=institution.vat
        
        // solana script to check thge delegeation in the token
        
    }

    return <>
        <div className="institution-wrapper">
            <form onSubmit={handleSubmit1}>
                <h1>Add a service</h1>
                <br />
                <label>Service Name</label>
                <br />
                <input type="text" name="service" />
                <br />
                <button type="submit">Store</button>
            </form>
            <br />
            <form onSubmit={handleFormViewDelegations}>
                <h1>View delegations</h1>
                <br></br>
                <label>Insert Address</label>
                <br />
                <input type="text" name="address" />
                <br />
                <button type="submit">View</button>
            </form>
            {delegations}
        </div>
    </>;
}

export default Institutionpage;