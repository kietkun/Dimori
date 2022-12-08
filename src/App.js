import { AddRental, Home, Rentals, BookedSchedules, YourRentals } from './pages'
import { Route, Routes, HashRouter } from "react-router-dom";

function App() {

    return (
        <div>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/rentals" element={<Rentals />} />
                    <Route path="/add-rental" element={<AddRental />} />
                    <Route path="/booked-schedules" element={<BookedSchedules />} />
                    <Route path="/your-rentals" element={<YourRentals />} />
                </Routes>
            </HashRouter>
        </div>
    );
}

export default App;
