"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import withAuth from "@/hoc/withAuth";
import NewsList from "./components/NewsList";

const Dashboard = () => {
    const {  token } = useSelector((state: RootState) => state.auth);


    if (!token) {
        return <p>Перенапрвление на страницу входа...</p>
    }

    return (

        <div className="p-6">

            <NewsList />
           
        </div>
    )
}

export default withAuth(Dashboard);