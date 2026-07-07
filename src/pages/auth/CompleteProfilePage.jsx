import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MapPin, Phone } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'


const CompleteProfilePage = () => {

  const navigate = useNavigate()

  const {
    updateUser
  } = useAuth()


  const [form,setForm] = useState({
    phone:'',
    address:''
  })


  const [loading,setLoading] = useState(false)



  const handleChange = (e)=>{

    setForm({
      ...form,
      [e.target.name]:e.target.value
    })

  }



  const handleSubmit = async(e)=>{

    e.preventDefault()

    setLoading(true)


    try{

      const res =
        await api.put(
          '/auth/complete-profile',
          form
        )


      updateUser(
        res.data.user
      )


      toast.success(
        'Profile completed 🎉'
      )


      navigate('/dashboard')


    }catch(err){

      toast.error(
        err?.response?.data?.message ||
        'Something went wrong'
      )

    }finally{

      setLoading(false)

    }

  }



return (

<div className="
min-h-screen 
bg-gray-50 
flex 
items-center 
justify-center 
px-4
">


<div className="
w-full
max-w-md
bg-white
rounded-2xl
shadow-lg
p-6
sm:p-8
">


<h1 className="
text-2xl
font-bold
text-center
mb-2
">

Complete Your Profile

</h1>


<p className="
text-gray-500
text-center
mb-8
">

Add your contact details to continue

</p>



<form
onSubmit={handleSubmit}
className="space-y-5"
>


<div>

<label className="label">
Phone Number
</label>


<div className="relative">

<Phone
className="
absolute
left-3
top-3
text-gray-400
"
size={18}
/>


<input

name="phone"

value={form.phone}

onChange={handleChange}

className="
input-field
pl-10
"

placeholder="07X XXX XXXX"

required

/>

</div>

</div>




<div>

<label className="label">
Address
</label>


<div className="relative">

<MapPin
className="
absolute
left-3
top-3
text-gray-400
"
size={18}
/>


<textarea

name="address"

value={form.address}

onChange={handleChange}

className="
input-field
pl-10
min-h-[120px]
resize-none
"

placeholder="Your delivery address"

required

/>

</div>

</div>



<button

disabled={loading}

className="
btn-primary
w-full
justify-center
py-3
disabled:opacity-60
"

>

{
loading
?
'Saving...'
:
'Complete Profile'
}

</button>



</form>


</div>


</div>

)

}


export default CompleteProfilePage