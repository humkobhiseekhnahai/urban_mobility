import React from 'react'
import { NavBarComponent } from '../components/navBarComponent'
import RouteDashboard from '../components/publicComponents/routeDashboard'

export const Public = () => {
  return (
    <div className="flex h-screen bg-black">
    <NavBarComponent/>
    <div className="flex-1">
      <RouteDashboard />
    </div>
  </div>
  )
}
