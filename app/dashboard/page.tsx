"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import withAuth from "@/hoc/withAuth";
import InterestingList from "./components/InterestingList";

const Dashboard = () => {
    const {  token } = useSelector((state: RootState) => state.auth);


    if (!token) {
        return <p>Перенапрвление на страницу входа...</p>
    }

    return (

        <div className="p-6">

            <InterestingList />
           
        </div>
    )
}

export default withAuth(Dashboard);