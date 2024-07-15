import "./Subscribe.css";
require("dotenv").config();

function Registeruser({ setDisplay }) {
  async function handleSubmit(e) {
    e.preventDefault();

    let name = e.target.name.value;
    let surname = e.target.surname.value;
    let email = e.target.email.value;
    let taxcode = e.target.taxcode.value;
    let password = e.target.password.value;

    var toBeSent = {
      name: name,
      surname: surname,
      email: email,
      taxcode: taxcode,
      password: password,
    };

    fetch("https://delegate-x-backend.vercel.app/v1/registeruser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toBeSent),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.stored) alert("user stored");
        else alert("user not stored: " + response.error);
      });
  }

  function handleClick(e) {
    e.preventDefault();
    setDisplay(true);
  }

  return (
    <>
      <form className="user-institution-register-form" onSubmit={handleSubmit}>
        <h1>Insert your information</h1>
        <label>Name: </label>
        <input type="text" name="name" />
        <br />
        <br />
        <label>Surname: </label>
        <input type="text" name="surname" />
        <br />
        <br />
        <label>Email: </label>
        <input type="text" name="email" />
        <br />
        <br />
        <label>Tax code: </label>
        <input type="text" name="taxcode" />
        <br />
        <br />
        <label>Password: </label>
        <input type="password" name="password" />
        <br />
        <br />
        <button type="submit">register</button>
        <br />
        <br />
        <u>
          <b>
            <label>
              Pay attention to the account selected on metamask,
              <br /> it will be bounded to the user
            </label>
          </b>
        </u>
        <br />
        <br />
        <button onClick={handleClick}>back</button>
      </form>
    </>
  );
}

export default Registeruser;
