import { AddRental, Home, Rentals, BookedSchedules, YourRentals } from './pages'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/#/" element={<Home />} />
                    <Route path="/#/rentals" element={<Rentals />} />
                    <Route path="/#/add-rental" element={<AddRental />} />
                    <Route path="/#/booked-schedules" element={<BookedSchedules />} />
                    <Route path="/#/your-rentals" element={<YourRentals />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
