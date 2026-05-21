import { Outlet } from "react-router";
import PublicHeader from "../component/PublicHeader";
import { business, services, staffs, timeSlots } from "../data/mockdata";


export default function PublicLayout() {

  return (
    <div className="min-h-screen bg-white">

      <PublicHeader data={business}/>
    
      <main>
        <Outlet context={{business, services, staffs, timeSlots}}/>
      </main>

    </div>
  );
}