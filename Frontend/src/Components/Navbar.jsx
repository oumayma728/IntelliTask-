export default function Navbar(){
    return(
        <nav className="bg-gray-400 text-white p-4 justify between items-center">
            
            <ul className="flex gap-7">
                <li><a href="/" className="hover:text-blue-200">Home</a></li>
                <li><a href="/" className="hover:text-blue-200">Notifications</a></li>
                <li><a href="/"  className="hover:text-blue-200">Invite members</a></li>
                <li><a href="/"  className="hover:text-blue-200">Search</a></li>
            </ul>
        <div className=" flex items-center gap-3">
        <span>Oumayma</span>
        <img
        src="" 
        alt="Profile"
        className="w-10 h-10 rounded-full"
        />
    </div>
        </nav>
    );
} 