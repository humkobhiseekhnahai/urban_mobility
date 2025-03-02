import { Delivery_new } from '../components/deliveryComponets/delivery_main'
import { NavBarComponent } from '../components/navBarComponent'
import { fetchCoordinates } from '../lib/fetch_location_coordinates'

const data = await fetchCoordinates("vijaya apartment, indirapuram,Uttar pradesh,201014, India")
export const Delivery = () => {
  console.log(data)
  return (
    <div className='flex'>
      <NavBarComponent/>
      <Delivery_new/>
   
    </div>
  )
}
