import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Userpage.css";

function Userpage({ authenticated, user }) {
  const [options, setOptions] = useState(<></>);
  const [services, setServices] = useState(<></>);
  const [services1, setServices1] = useState(<></>);
  const [delegations, setDelegations] = useState(<></>);
  const [loaded, setLoaded] = useState(false);
  const [showDelegations, setShowDelegations] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) navigate("/error");
    if (!loaded) {
      fetch("https://delegate-x-backend.vercel.app/v1/institutions", {
        method: "GET",
      })
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          let sup = [];
          let institutions = res.institutions;
          for (let i = 0; i < institutions.length; i++) {
            let value = {
              vat: institutions[i].vat,
              address: institutions[i].address,
            };
            sup.push(
              <option key={i} value={JSON.stringify(value)}>
                {institutions[i].name}
              </option>
            );
          }
          setOptions(sup);

          let toBeSent = {
            vat: res.institutions[0].vat,
          };

          fetch("https://delegate-x-backend.vercel.app/v1/services", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toBeSent),
          })
            .then((response) => {
              return response.json();
            })
            .then((res) => {
              let sup = [];
              for (let i = 0; i < res.services.length; i++) {
                sup.push(
                  <option key={i} value={res.services[i]}>
                    {res.services[i]}
                  </option>
                );
              }
              setServices(sup);
              setServices1(sup);
            });
        });
      setLoaded(true);
    }
  });

  async function handleSubmit1(e) {
    e.preventDefault();

    //take the correct data
    let address = e.target.delegated_address.value;
    let vat = JSON.parse(e.target.vat.value).vat;
    let service = e.target.service.value;
    let institutionAddress = JSON.parse(e.target.vat.value).address;

    //invoke the solana script to create the token
  }

  function handleChange(e) {
    e.preventDefault();

    let vat = JSON.parse(e.target.value).vat;

    let toBeSent = {
      vat: vat,
    };

    fetch("https://delegate-x-backend.vercel.app/v1/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toBeSent),
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        let sup = [];
        for (let i = 0; i < res.services.length; i++) {
          sup.push(<option value={res.services[i]}>{res.services[i]} </option>);
        }
        setServices(sup);
      });
  }

  async function handleDeleteDelegation(e) {
    e.preventDefault();
    let address = e.target.delegated_address.value;
    let service = e.target.service.value;
    let institutionAddress = JSON.parse(e.target.vat.value).address;
    let vat = JSON.parse(e.target.vat.value).vat;

    let toBeSent = {
      vat: vat,
      taxcode: user.taxcode,
      service: service,
    };

    let res = await fetch("https://delegate-x-backend.vercel.app/v1/encode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toBeSent),
    }).then((response) => {
      return response.json();
    });
    let encodedService = res.encoded;

    //if(accounts[0]===user.address){
    // contract.events.debug(options, (error, event) => {
    //     if (error) {
    //         console.error("Error:", error);
    //         return;
    //     }

    //     // Handle the event data
    //     console.log("Event received:", event.returnValues);
    // })
    //     .on("data", (event) => {
    //         if (event.code === "delegation alredy exists")
    //             alert("delegation alredy exists");
    //         console.log(event);
    //     })
    // contract.methods.deleteDelegation(address, institutionAddress, encodedService).send({ from: accounts[0] })
    //     .then((res) => {
    //         if (!res) {
    //             alert("Could not delete delegation");
    //         } else {
    //             alert("Delegation deleted!");
    //         }

    //     })
    //     .catch((err) => { console.log("error in delete delegation"); console.log(err) });
    //}
  }

  return (
    <div className="user-wrapper">
      <section>
        <h1>Delegate</h1>
        <form onSubmit={handleSubmit1}>
          <br />
          <label>delegated address</label>
          <br />
          <input type="text" name="delegated_address" />
          <br />
          <label>vat of company to delegate</label>
          <br />
          <select name="vat" onChange={handleChange}>
            {options}
          </select>
          <br />
          <label>service to delegate</label>
          <br />
          <select name="service">{services}</select>
          <br />
          <br />
          <button type="submit">Delegate</button>
        </form>
      </section>

      <section>
        <h1>Delete Delegation</h1>
        <form onSubmit={handleDeleteDelegation}>
          <br />
          <label>delegated address</label>
          <br />
          <input type="text" name="delegated_address" />
          <br />
          <label>vat of company</label>
          <br />
          <select name="vat" onChange={handleChange}>
            {options}
          </select>
          <br />
          <label>service delegated</label>
          <br />
          <select name="service">{services}</select>
          <br />
          <br />
          <button type="submit">Delete</button>
        </form>
      </section>
    </div>
  );
}

export default Userpage;
