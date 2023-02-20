import { useState, useEffect } from "react"
import { FaUser } from "react-icons/fa"

function Register() {
  // instead of individual variables, we set them in a form Object
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  // destrcutre parameters from the form
  const {name, email, password, password2} = formData

  const onChange = () => {}
  return <>
    <section className='heading'>
      <h1>
        <FaUser /> Register
      </h1>
      <p>Please create an account</p>
    </section>

    <section className='form'>
      <form>
        <input type="text" className="form-control" id="name"
        name='name' value={name} placeholder='Enter your name'
        onChange={onChange}/>
      </form>
    </section>
  </>
}

export default Register