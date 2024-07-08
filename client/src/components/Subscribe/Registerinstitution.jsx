require('dotenv').config();


function RegisterInstitution({setDisplay}){



    async function handleSubmit(e){
        e.preventDefault();
        
        let name =e.target.name.value;
        let email =e.target.email.value;
        let vat =e.target.vat.value;
        let password =e.target.password.value;

        var toBeSent={
            name:name,
            email:email,
            vat:vat,
            password:password
        };

        fetch("http://localhost:3000/v1/registerinstitution",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(toBeSent)
        }) 
        .then(response => {
            return response.json();
        })
        .then(response =>{
            if(response.stored)
                alert("institution stored");
            else
                alert("institution not stored: " + response.error);
        })
    }

    function handleClick(e){
        e.preventDefault(); 
        setDisplay(true);
    }

    return (
        <>
         <form className="user-institution-register-form" onSubmit={handleSubmit}>
            <h1>Insert your information</h1>
            <label >Institution name: </label>
            <input type="text" name="name"  />
            <br />
            <br />
            <label >VAT code: </label>
            <input type="text" name="vat"  />
            <br />
            <br />
            <label >email: </label>
            <input type="text" name="email"  />
            <br />
            <br />
            <label >password: </label>
            <input type="password" name="password"  />
            <br />
            <br />
            <button type="submit">register</button>
            
            <br />
            <br />
            <u><b><label>Pay attention to the account selected on metamask,<br /> it will be bounded to the institution</label></b></u>
            <br />
            <br />
            <button onClick={handleClick}>back</button>
            
        </form>
        </>
    );
}

export default RegisterInstitution;