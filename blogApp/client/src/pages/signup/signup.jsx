
import React from 'react'

const Signup = () => {
  return (
<>
<div>
    <h1>User Regitration</h1>
  <form action='post'>
<p>Name:</p>
<input type="text" name="name" />
<p>Email:</p>
<input type="text" name="email" />
<p>Password:</p>
<input type="password" name='password' />
<p>Confirm Password: </p>
<input type="password" name='confirmPassword'/>

<input type="submit" value="signup" />

  </form>
</div>

</>
)
}

export default Signup