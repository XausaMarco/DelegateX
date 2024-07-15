import { useNavigate } from "react-router-dom";
import './Userpage.css'
import { useEffect, useState } from "react";
const createMetadata = require("../../solana/uploadMetadata");
const mintToken = require("../../solana/mintToken");


function Userpage({ authenticated, user }) {

    const [options, setOptions] = useState(<></>);
    const [services, setServices] = useState(<></>);
    const [loaded, setLoaded] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        if (!authenticated)
            navigate("/error");
        if (!loaded) {
            fetch("http://localhost:3000/v1/institutions", { method: 'GET' })
                .then(response => {
                    return response.json();
                })
                .then(res => {
                    let sup = [];
                    let institutions = res.institutions;
                    for (let i = 0; i < institutions.length; i++) {
                        let value = {
                            vat: institutions[i].vat,
                            address: institutions[i].address
                        }
                        sup.push(<option key={i} value={JSON.stringify(value)}>{institutions[i].name}</option>);
                    }
                    setOptions(sup);

                    let toBeSent = {
                        vat: res.institutions[0].vat
                    }

                    fetch("http://localhost:3000/v1/services", {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(toBeSent)
                    })
                        .then(response => {
                            return response.json();
                        })
                        .then((res) => {
                            let sup = [];
                            for (let i = 0; i < res.services.length; i++) {
                                sup.push(<option key={i} value={res.services[i]}>{res.services[i]}</option>);
                            }
                            setServices(sup);
                        })
                })
            setLoaded(true);
        }

    });


    async function handleSubmit1(e) {
        e.preventDefault();

        //take the correct data
        const delegated = e.target.delegated.value;
        const vat = JSON.parse(e.target.vat.value).vat;
        const service = e.target.service.value;
        
        const uri = await createMetadata([
            {
                trait_type: "delegated",
                value: delegated,
            },
            {
                trait_type: "vat",
                value: vat,
            },
            {
                trait_type: "service",
                value: service,
            }
        ]);
        const signature = await mintToken(uri,user.solanaSecret);
        if(signature){
            console.log(signature);
            fetch("http://localhost:3000/v1/addsignature", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taxcode: user.taxcode,
                    signature
                })
            })
        }



    }

   

    function handleChange(e) {
        e.preventDefault();

        let vat = JSON.parse(e.target.value).vat;

        let toBeSent = {
            vat: vat
        }

        fetch("http://localhost:3000/v1/services", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toBeSent)
        })
            .then(response => {
                return response.json();
            })
            .then((res) => {
                let sup = [];
                for (let i = 0; i < res.services.length; i++) {
                    sup.push(<option value={res.services[i]} >{res.services[i]} </option>);
                }
                setServices(sup);
            })
    }



    return (
        <div className="user-wrapper">
            <section>
                <h1>Delegate</h1>
                <form onSubmit={handleSubmit1}>
                    <br />
                    <label>delegated</label>
                    <br />
                    <input type="text" name="delegated" />
                    <br />
                    <label>vat of company to delegate</label>
                    <br />
                    <select name="vat" onChange={handleChange}>
                        {options}
                    </select>
                    <br />
                    <label>service to delegate</label>
                    <br />
                    <select name="service">
                        {services}
                    </select>
                    <br />
                    <br />
                    <button type="submit">Delegate</button>
                </form>
            </section>

        </div>
    );
}

export default Userpage;