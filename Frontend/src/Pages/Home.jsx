import { Button } from "@headlessui/react";
import { Link } from "react-router-dom";
import Login from "./Login";

export default function Home()
{
    return(
    <div>
        <h1>IntelliTask</h1>
        <h2>Work Smarter</h2>
        <Button>
            Get Started
        <Link to={Login}>
        </Link>
        </Button>
    </div>
    )
}